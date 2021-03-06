function gerar() {
  if (confirm("Quer prosseguir com a geração dos seus arquivos?")) {
    preencherCodigoGerado();
    ocultaCamposSelecionaveis();
    mostraCamposResultado();
  }
}

function fechar() {
  document.location = "";
}

function ocultaCamposSelecionaveis() {
  document.getElementById("fldDockerCompose").style.visibility = "hidden";
  document.getElementById("fldBackend").style.visibility = "hidden";
  document.getElementById("fldServicos").style.display = "none";
  document.getElementById("fldServicos").style.height = "0px";
  document.getElementById("fldDockerCompose").style.height = "0px";
  document.getElementById("fldBackend").style.height = "0px";
}

function mostraCamposSelecionaveis() {
  document.getElementById("fldDockerCompose").style.visibility = "visible";
  document.getElementById("fldBackend").style.visibility = "visible";
  document.getElementById("fldServicos").style.display = "visible";
  document.getElementById("fldServicos").style.height = "";
  document.getElementById("fldDockerCompose").style.height = "";
  document.getElementById("fldBackend").style.height = "";
}

function ocultaCamposResultado() {
  document.getElementById("resultado").style.display = "none";
  document.getElementById("gerador").style.display = "";
}

function mostraCamposResultado() {
  document.getElementById("resultado").style.display = "";
  document.getElementById("gerador").style.display = "none";
}

function preencherCodigoGerado() {
  let dockerComposeVersao = document.getElementById("dockerComposeVersao");
  let frameworkSelecionado = document.getElementById("framework");

  //redis
  let redis = document.getElementById("redis").checked;

  // elastic
  let elastic762 = document.getElementById("elastic762").checked;
  let elastic684 = document.getElementById("elastic684").checked;

  // kibana
  let kibana762 = document.getElementById("kibana762").checked;
  let kibana684 = document.getElementById("kibana684").checked;

  // mongo express
  let mongoExpress = document.getElementById("mongoExpress").checked;

  // zookeeper
  let zookeeper = document.getElementById("zookeeper").checked;

  // kafka
  let kafka = document.getElementById("kafka").checked;
  let kafkadrop = document.getElementById("kafkadrop").checked;
  let nomeTopicoPadrao = "new_user_topic";
  let consumerGroupPadrao = "tdcConsumerGroup";

  // maildev
  let maildev = document.getElementById("maildev").checked;

  // mongo
  let mongo36 = document.getElementById("mongo36").checked;
  let mongo40 = document.getElementById("mongo40").checked;
  let mongo44 = document.getElementById("mongo44").checked;
  let nomeBancoMongo = "tdc2020";

  // gerar texto do docker-compose.yml
  let dependsRedis = "";
  let dependsMongo = "";
  let dependsElastic = "";
  let dependsKafka = "";
  let dependsZookeeper = "";
  let dependsKibana = "";
  let dependsMailDev = "";
  let subConfigElastic = "";
  let subConfigMongo = "";

  var optFramework =
    frameworkSelecionado.options[frameworkSelecionado.selectedIndex];
  let nomeRedeBackend = "backend";

  let configElastic = "";
  if (elastic762) {
    configElastic =
      "elasticsearch:\n" +
      "    hostname: elasticsearch\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend +
      "\n" +
      "    container_name: elasticsearch\n" +
      "    image: docker.elastic.co/elasticsearch/elasticsearch:7.6.2\n" +
      "    environment:\n" +
      "      - discovery.type=single-node\n" +
      "    ports:\n" +
      "      - 9200:9200\n" +
      "      - 9300:9300\n" +
      "    healthcheck:\n" +
      "      test: ['CMD', 'curl', '-f', 'http://localhost:9200']\n" +
      "      interval: 20s\n" +
      "      timeout: 5s\n" +
      "      retries: 10";
    dependsElastic = "- elasticsearch";
    subConfigElastic =
      "- SPRING_ELASTICSEARCH_REST_URIS=http://elasticsearch:9200\n" +
      "      - SPRING_DATA_ELASTICSEARCH_CLUSTER_NAME=docker-cluster\n" +
      "      - SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES=elasticsearch:9300";
  }

  let configKibana = "";
  if (kibana762) {
    configKibana =
      "kibana:\n" +
      "    hostname: kibana\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend +
      "\n" +
      "    container_name: kibana\n" +
      "    image: docker.elastic.co/kibana/kibana:7.6.2\n" +
      "    ports:\n" +
      "      - 5601:5601\n" +
      "    healthcheck:\n" +
      "      test: ['CMD', 'curl', '-f', 'http://localhost:5601']\n" +
      "      interval: 20s\n" +
      "      timeout: 5s\n" +
      "      retries: 10\n" +
      "    depends_on:\n" +
      "      - elasticsearch";
    dependsKibana = "- kibana";
  }

  let configMongo = "";
  if (mongo44) {
    configMongo =
      "mongo0:\n" +
      "    hostname: mongo0\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend +
      "\n" +
      "    container_name: mongo0\n" +
      "    image: mongo\n" +
      "    ports:\n" +
      "      - 27017:27017\n" +
      "    restart: on-failure";

    dependsMongo = "- mongo0";
    subConfigMongo =
      "- SPRING_DATA_MONGODB_DATABASE=" +
      nomeBancoMongo +
      "\n" +
      "      - SPRING_DATA_MONGODB_URI=mongodb://mongo0:27017";
  }

  let configMongoExpress = "";
  if (mongoExpress) {
    configMongoExpress =
      "mongo-express:\n" +
      "    image: mongo-express\n" +
      "    restart: always\n" +
      "    depends_on:\n" +
      "      - mongo0\n" +
      "    ports:\n" +
      "      - 8081:8081\n" +
      "    environment:\n" +
      "      - ME_CONFIG_MONGODB_SERVER=mongo0\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend;
  }

  let configZooKeeper = "";
  if (zookeeper) {
    configZooKeeper =
      "zookeeper:\n" +
      "    image: 'bitnami/zookeeper:latest'\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend +
      "\n" +
      "    ports:\n" +
      "      - '2181:2181'\n" +
      "    environment:\n" +
      "      - ALLOW_ANONYMOUS_LOGIN=yes";
    dependsZookeeper = "- zookeeper";
  }

  let configKafka = "";
  if (kafka) {
    configKafka =
      "kafka:\n" +
      "    image: 'bitnami/kafka:latest'\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend +
      "\n" +
      "    ports:\n" +
      "      - '9092:9092'\n" +
      "    environment:\n" +
      "      - KAFKA_BROKER_ID=1\n" +
      "      - KAFKA_LISTENERS=PLAINTEXT://:9092\n" +
      "      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092\n" +
      "      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181\n" +
      "      - ALLOW_PLAINTEXT_LISTENER=yes\n" +
      "    depends_on:\n" +
      "      - zookeeper";
    dependsKafka = "- kafka";
  }

  let configKafkaDrop = "";
  if (kafkadrop) {
    configKafkaDrop = "";
  }

  let configMailDev = "";
  if (maildev) {
    configMailDev =
      "maildev:\n" +
      "    image: maildev/maildev\n" +
      "    ports:\n" +
      "      - 1080:80\n" +
      "      - 25:25\n" +
      "    networks:\n" +
      "      - " +
      nomeRedeBackend;
    dependsMailDev = "- maildev";
  }

  let configRedis = "";
  if (redis) {
    configRedis =
        "redis:\n" +
        "    restart: on-failure\n" +
        "    image: 'bitnami/redis:latest'\n" +
        "    networks:\n" +
        "      - " +
        nomeRedeBackend +
        "\n" +
        "    ports:\n" +
        "      - 6379:6379\n" +
        "    environment:\n" +
        "      - ALLOW_EMPTY_PASSWORD=yes";
    dependsRedis = "- redis";
  }

  let configSpringBoot = ` 
  demo-service:
    image: sample-container
    networks:
      - ${nomeRedeBackend}
    build: .
    restart: on-failure
    ports:
      - 8080:8080
    environment:
      ${subConfigElastic}
      ${subConfigMongo}
    depends_on:
      ${dependsRedis}
      ${dependsMongo}
      ${dependsElastic}
      ${dependsKafka}
      ${dependsKibana}
      ${dependsRedis}
      ${dependsMailDev}`;

  if (optFramework.value == 0) {
    configSpringBoot = "";
  }

  var optDockerComposeVersao =
    dockerComposeVersao.options[dockerComposeVersao.selectedIndex].value;
  let textoDockerComposeYaml = `
version: '${optDockerComposeVersao}'
services:
  ${configRedis}
  ${configMongo}
  ${configMongoExpress}
  ${configElastic}
  ${configKibana}
  ${configZooKeeper}
  ${configKafka}
  ${configKafkaDrop}
  ${configMailDev}
  ${configSpringBoot}
networks:
  ${nomeRedeBackend}:`;

  editor.setValue(textoDockerComposeYaml);

  // =======================================================
  // gerar texto do Dockerfile para spring boot
  let jdkSelecionada = "";
  if (optFramework.value == 1) {
    jdkSelecionada = "adoptopenjdk/openjdk11:alpine-jre";
  } else if (optFramework.value == 2) {
    jdkSelecionada = "adoptopenjdk/openjdk8:alpine-jre";
  } else if (optFramework.value == 3) {
    jdkSelecionada = "adoptopenjdk/openjdk14:alpine-jre";
  }

  const JAR_FILE = '${JAR_FILE}';

  let textoDockerFileBackend = `FROM ${jdkSelecionada}
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
ARG JAR_FILE=build/libs/sample-0.0.1-SNAPSHOT.jar app.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]`;

  if (optFramework.value == 0) {
    textoDockerFileBackend = "";
  }

  editor2.setValue(textoDockerFileBackend);

  // ====================================================
  // gerar texto do application.properties
  let textoProperties = "";

  if (elastic762 || elastic684) {
    textoProperties += `
spring.data.elasticsearch.cluster-name=docker-cluster
spring.elasticsearch.rest.uris=http://elasticsearch:9200
spring.data.elasticsearch.cluster-nodes=elasticsearch:9300
spring.data.elasticsearch.repositories.enabled=true`;
  }

  if (mongo44 || mongo40 || mongo36) {
    textoProperties += `
spring.data.mongodb.database=${nomeBancoMongo}`;
  }

  if (kafka) {
    textoProperties += `
spring.kafka.bootstrap-servers=kafka:9092
spring.kafka.consumer.group-id=${consumerGroupPadrao}
spring.kafka.template.default-topic=${nomeTopicoPadrao}`;
  }

  if (maildev) {
    textoProperties += `
spring.mail.host=maildev
spring.mail.port=25
# spring.mail.properties.mail.smtp.port=25
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
spring.mail.properties.mail.smtp.starttls.required=false`;
  }

  editor3.setValue(textoProperties);
}
