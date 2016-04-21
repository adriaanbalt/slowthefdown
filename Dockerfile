FROM slowthefdown/node-compass-image
MAINTAINER Adriaan Balt Louis Scholvinck <adriaan@balt.us>

WORKDIR /src/app
RUN ln -s /tmp/app/node_modules node_modules

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dockerdev"]