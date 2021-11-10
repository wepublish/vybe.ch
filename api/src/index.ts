#!/usr/bin/env node
import {
  WepublishServer,
  URLAdapter,
  PublicArticle,
  PublicPage,
  Author, PublicComment, Peer
} from '@wepublish/api'


import {KarmaMediaAdapter} from '@wepublish/api-media-karma'
import {URL} from 'url'
import {MongoDBAdapter} from '@wepublish/api-db-mongodb/lib'

import { program } from 'commander'

import pinoMultiStream from 'pino-multi-stream'
import pinoStackdriver from 'pino-stackdriver'
import {createWriteStream} from 'pino-sentry'

interface EasyvoteURLAdapterProps {
  readonly websiteURL: string
}


class VybeURLAdapter implements URLAdapter {

  readonly websiteURL: string

  constructor(props: EasyvoteURLAdapterProps) {
    this.websiteURL = props.websiteURL
  }

  getPublicArticleURL(article: PublicArticle): string {
    return article.canonicalUrl ?? 'https://vybe.ch'
  }

  getPublicPageURL(page: PublicPage): string {
    return `${this.websiteURL}/${page.slug}.${page.id}`
  }

  getAuthorURL(author: Author): string {
    return `https://vybe.ch/ueber-uns/`
  }

  getArticlePreviewURL(token: string): string {
    return `No Preview available`
  }

  getPagePreviewURL(token: string): string {
    return `No Preview available`
  }

  getCommentURL(item: PublicArticle | PublicPage, comment: PublicComment): string {
    return ''
  }

  getPeeredArticleURL(peer: Peer, article: PublicArticle): string {
    return ''
  }

}

async function asyncMain() {
  if (!process.env.MONGO_URL) throw new Error('No MONGO_URL defined in environment.')
  if (!process.env.HOST_URL) throw new Error('No HOST_URL defined in environment.')
  if (!process.env.WEBSITE_URL) throw new Error('No WEBSITE_URL defined in environment.')

  const hostURL = process.env.HOST_URL
  const websiteURL = process.env.WEBSITE_URL

  if (!process.env.MEDIA_SERVER_URL) {
    throw new Error('No MEDIA_SERVER_URL defined in environment.')
  }

  if (!process.env.MEDIA_SERVER_TOKEN) {
    throw new Error('No MEDIA_SERVER_TOKEN defined in environment.')
  }

  const mediaAdapter = new KarmaMediaAdapter(
    new URL(process.env.MEDIA_SERVER_URL),
    process.env.MEDIA_SERVER_TOKEN
  )

  await MongoDBAdapter.initialize({
    url: process.env.MONGO_URL!,
    locale: process.env.MONGO_LOCALE ?? 'en',
    seed: async adapter => {
      const adminUserRole = await adapter.userRole.getUserRole('Admin')
      const adminUserRoleId = adminUserRole ? adminUserRole.id : 'fake'

      await adapter.user.createUser({
        input: {
          email: 'admin@vybe.ch',
          name: 'Admin',
          emailVerifiedAt: null,
          roleIDs: [adminUserRoleId],
          active: true,
          properties: []
        },
        password: '1234qwer.'
      })
    }
  })

  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000
  const address = process.env.ADDRESS ? process.env.ADDRESS : 'localhost'

  const dbAdapter = await MongoDBAdapter.connect({
    url: process.env.MONGO_URL!,
    locale: process.env.MONGO_LOCALE ?? 'en'
  })


  const streams: pinoMultiStream.Streams = []
  if(process.env.NODE_ENV === 'development') {
    const prettyStream = pinoMultiStream.prettyStream()
    streams.push({stream: prettyStream})
  } else {
    if (!process.env.GOOGLE_PROJECT) throw new Error('No GOOGLE_PROJECT defined in environment.')
    if (!process.env.SENTRY_DSN) throw new Error('No SENTRY_DSN defined in environment.')
    streams.push({
      level: 'info',
      stream: pinoStackdriver.createWriteStream({
        projectId: process.env.GOOGLE_PROJECT,
        logName: 'juanita-api'
      })
    })
    streams.push({
      level: 'error',
      stream: createWriteStream({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.SENTRY_ENV ?? 'dev'
      })
    })
  }

  const logger = pinoMultiStream({
    streams,
    level: 'info'
  })

  const server = new WepublishServer({
    hostURL,
    websiteURL,
    mediaAdapter,
    dbAdapter,
    paymentProviders: [],
    mailContextOptions: {
      defaultFromAddress: 'no-reply@easyvote.ch',
      mailTemplateMaps: []
    },
    mailProvider: undefined,
    oauth2Providers: [],
    logger,
    urlAdapter: new VybeURLAdapter({websiteURL}),
    playground: false,
    introspection: true,
    tracing: true
  })

  program.version('0.0.1')

  program
    .command('listen')
    .description('start the api server')
    .action(async () => {
      await server.listen(port, address)
    })

  program.parse(process.argv);
}

asyncMain().catch(err => {
  console.error(err)
  process.exit(1)
})
