FROM node:16.13.0

WORKDIR /bot

COPY package.json .

RUN npm install

COPY . .

CMD [ "sudo ./run.sh" ]