FROM node:alpine

WORKDIR "/app"

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# this starts another phase to this docker file which then allows you to do something else, and it stops the prebiouse phase. to access the first phase just use 0
FROM nginx

#change the default setting
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# for deployment with elastic beanstalk you need to expose the port that will be used here in the docker file, this may no be required when using docker compose, i need to look that up
EXPOSE 3000

# this goes copy the data from the last phase in its app/ build folder and put it into the nginx/hmtl folder in this new phase
COPY --from=0 /app/build /usr/share/nginx/html

#with nginx we do not need to put in a run command as its default setting will sort all that out for us
