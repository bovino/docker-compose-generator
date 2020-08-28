function gerar(){
    if(confirm('Quer prosseguir com a geração dos seus arquivos?')){
        preencherCodigoGerado();
        ocultaCamposSelecionaveis();
        mostraCamposResultado();
    }
}

function fechar(){
    document.location='';
}

function ocultaCamposSelecionaveis(){
    document.getElementById('fldDockerCompose').style.visibility = 'hidden';
    document.getElementById('fldBackend').style.visibility = 'hidden';
    document.getElementById('fldServicos').style.visibility = 'hidden';
    document.getElementById('fldServicos').style.height = '0px';
    document.getElementById('fldDockerCompose').style.height = '0px';
    document.getElementById('fldBackend').style.height = '0px';
}

function mostraCamposSelecionaveis(){
    document.getElementById('fldDockerCompose').style.visibility = 'visible';
    document.getElementById('fldBackend').style.visibility = 'visible';
    document.getElementById('fldServicos').style.visibility = 'visible';
    document.getElementById('fldServicos').style.height = '';
    document.getElementById('fldDockerCompose').style.height = '';
    document.getElementById('fldBackend').style.height = '';
}

function ocultaCamposResultado(){
    document.getElementById('fldResultado1').style.visibility = 'hidden';
    document.getElementById('fldResultado2').style.visibility = 'hidden';
    document.getElementById('fldResultado3').style.visibility = 'hidden';
}

function mostraCamposResultado(){
    document.getElementById('fldResultado1').style.visibility = 'visible';
    document.getElementById('fldResultado2').style.visibility = 'visible';
    document.getElementById('fldResultado3').style.visibility = 'visible';
}

function preencherCodigoGerado(){

    let dockerComposeVersao = document.getElementById('dockerComposeVersao');
    let frameworkSelecionado = document.getElementById('framework');

    // elastic
    let elastic762 = document.getElementById('elastic762').checked;
    let elastic684 = document.getElementById('elastic684').checked;

    // kibana
    let kibana762 = document.getElementById('kibana762').checked;
    let kibana684 = document.getElementById('kibana684').checked;

    // mongo express
    let mongoExpress = document.getElementById('mongoExpress').checked;

    // kafka
    let kafka = document.getElementById('kafka').checked;
    let kafkadrop = document.getElementById('kafkadrop').checked;
    let nomeTopicoPadrao = 'new_user_topic';
    let consumerGroupPadrao = 'tdcConsumerGroup';

    // maildev
    let maildev = document.getElementById('maildev').checked;

    // mongo
    let mongo36 = document.getElementById('mongo36').checked;
    let mongo40 = document.getElementById('mongo40').checked;
    let mongo44 = document.getElementById('mongo44').checked;
    let nomeBancoMongo = 'tdc2020';

    // gerar texto do docker-compose.yml
    let dependsMongo = '';
    let dependsElastic = '';
    let dependsKafka = '';
    let dependsKibana = '';
    let dependsMailDev = '';
    let subConfigElastic = '';
    let subConfigMongo = '';

    var optFramework = frameworkSelecionado.options[frameworkSelecionado.selectedIndex];
    let nomeRedeBackend = 'backend';

    let configElastic = '';
    if(elastic762){
        dependsElastic = '- elasticsearch';
        subConfigElastic = '- SPRING_ELASTICSEARCH_REST_URIS=http://elasticsearch:9200\n' +
            '      - SPRING_DATA_ELASTICSEARCH_CLUSTER_NAME=docker-cluster\n' +
            '      - SPRING_DATA_ELASTICSEARCH_CLUSTER_NODES=elasticsearch:9300';
    }

    let configKibana = '';
    if(kibana762){
        dependsKibana = '- kibana';
    }

    let configMongo = '';
    if(mongo44){
        configMongo = 'mongo0:\n' +
            '    hostname: mongo0\n' +
            '    networks:\n' +
            '      - backend\n' +
            '    container_name: mongo0\n' +
            '    image: mongo\n' +
            '    ports:\n' +
            '      - 27017:27017\n' +
            '    restart: on-failure';

        dependsMongo = '- mongo0';
        subConfigMongo = '- SPRING_DATA_MONGODB_DATABASE=' + nomeBancoMongo + '\n' +
            '      - SPRING_DATA_MONGODB_URI=mongodb://mongo0:27017';
    }

    let configMongoExpress = '';
    if(mongoExpress){
    }

    let configKafka = '';
    if(kafka){
        configKafka = '- kafka';
    }

    if(kafkadrop){

    }

    let configMailDev = '';
    if(maildev){
        dependsMailDev = '- maildev';
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
      ${dependsMongo}
      ${dependsElastic}
      ${dependsKafka}
      ${dependsKibana}
      ${dependsMailDev}`;

    if(optFramework.value == 0){
        configSpringBoot = '';
    }

    var optDockerComposeVersao = dockerComposeVersao.options[dockerComposeVersao.selectedIndex].value;
    let textoDockerComposeYaml = `
version: '${optDockerComposeVersao}'
services:
  ${configMongo}
  ${configMongoExpress}
  ${configElastic}
  ${configKibana}
  ${configKafka}
  ${configMailDev}
  ${configSpringBoot}
networks:
  ${nomeRedeBackend}:`;

    editor.setValue(textoDockerComposeYaml);

    // =======================================================
    // gerar texto do Dockerfile para spring boot
    let jdkSelecionada = '';
    if(optFramework.value == 1){
        jdkSelecionada = 'adoptopenjdk/openjdk11:alpine-jre';
    } else if(optFramework.value == 2){
        jdkSelecionada = 'adoptopenjdk/openjdk8:alpine-jre';
    } else if(optFramework.value == 3){
        jdkSelecionada = 'adoptopenjdk/openjdk14:alpine-jre';
    }

    let textoDockerFileBackend = `FROM ${jdkSelecionada}
ADD build/libs/sample-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]`;

    if(optFramework.value == 0){
        textoDockerFileBackend = '';
    }

    editor2.setValue(textoDockerFileBackend);

    // ====================================================
    // gerar texto do application.properties
    let textoProperties = '';

    if(elastic762 || elastic684){
        textoProperties += `
spring.data.elasticsearch.cluster-name=docker-cluster
spring.elasticsearch.rest.uris=http://elasticsearch:9200
spring.data.elasticsearch.cluster-nodes=elasticsearch:9300
spring.data.elasticsearch.repositories.enabled=true`;
    }

    if(mongo44 || mongo40 || mongo36){
        textoProperties += `
spring.data.mongodb.database=${nomeBancoMongo}`;
    }

    if(kafka){
        textoProperties += `
spring.kafka.bootstrap-servers=kafka:9092
spring.kafka.consumer.group-id=${consumerGroupPadrao}
spring.kafka.template.default-topic=${nomeTopicoPadrao}`;
    }

    if(maildev){
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