#基础镜像
FROM node:lts-bullseye-slim 

ADD . /web
#切换工作目录
WORKDIR /web
#切换镜像源
RUN npm config set registry https://registry.npm.taobao.org \
  && npm install \
  && npm run build \
  && echo "Asia/Shanghai" > /etc/timezone
#声明需要暴露的接口
EXPOSE 3000

CMD [ "npm","run","prod" ]
