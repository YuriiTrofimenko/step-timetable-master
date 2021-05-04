FROM maven:3.8.1-openjdk-11
RUN /bin/bash -c "ln -snf /usr/share/zoneinfo/Europe/Kiev /etc/localtime && dpkg-reconfigure -f noninteractive tzdata"
WORKDIR /usr/src/java-app
COPY . .
EXPOSE 8080