FROM node:9.9.0
LABEL maintainer="ldw1216@foxmail.com"

WORKDIR /www/
RUN npm config set registry https://registry.npm.taobao.org

ADD ./package.json /www/
RUN npm install --production

ENV TZ=Asia/Shanghai \
    NODE_ENV="production" \
    MONGOOSE_URI="" \
    PORT=3000 

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ADD . /www/


EXPOSE 3000

CMD ["npm", "start"]

