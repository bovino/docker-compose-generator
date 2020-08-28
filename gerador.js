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
    let textoDockerComposeYaml = '';

    if(elastic762){

    }

    if(mongo44){

    }

    if(mongoExpress){

    }



    editor.setValue(textoDockerComposeYaml);

    // =======================================================
    // gerar texto do Dockerfile para spring boot
    var optFramework = frameworkSelecionado.options[frameworkSelecionado.selectedIndex];

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