FROM node:12.20.1-alpine

RUN apk update

ARG LIBVIPS_VERSION=8.7.0
ARG LIBVIPS_SOURCE_TAR="vips-${LIBVIPS_VERSION}.tar.gz"
ARG LIBVIPS_SOURCE_URL="https://github.com/libvips/libvips/releases/download/v${LIBVIPS_VERSION}/${LIBVIPS_SOURCE_TAR}"

# Install build tools
RUN apk add python gcc g++ make --update-cache

# Install libvips dependencies
RUN apk add libjpeg-turbo-dev libexif-dev lcms2-dev fftw-dev giflib-dev glib-dev libpng-dev \
  libwebp-dev expat-dev orc-dev tiff-dev librsvg-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/

# Build libvips with SVG support
RUN mkdir ./libvips \
  && cd ./libvips \
  && wget ${LIBVIPS_SOURCE_URL} \
  && tar -xzf ${LIBVIPS_SOURCE_TAR} --strip 1 \
  && ./configure \
  --prefix=/usr \
  --enable-debug=no \
  --without-gsf \
  --disable-static \
  --mandir=/usr/share/man \
  --infodir=/usr/share/info \
  --docdir=/usr/share/doc \
  && make \
  && make install

USER node
RUN mkdir -p /home/node
WORKDIR /home/node
ENV NODE_ENV=production
ENV ADDRESS=0.0.0.0
ENV PORT=4001


COPY --chown=node:node package.json ./
RUN yarn install

COPY --chown=node:node ./dist/ ./dist/

EXPOSE 4001
CMD [ "yarn", "start" ]
