# docker-compose-generator
App simples para acelerar geração de arquivos docker-compose.yml. Na verdade, o gerador também gera o arquivo Dockerfile e application.properties para usar no seu app backend, além de gerar o docker-composer.yml propriamente dito.

Não se assuste, o código é apenas uma página HTML e um arquivo JS mesmo (por enquanto)

Para usar o gerador é muito simples:

- clone o projeto usando algum cliente git ou baixe
- abra o index.html no Chrome e siga as opções na tela
- selecione os recursos e versões necessários para o seu projeto e clique em "gerar"
- coloque o Dockerfile e docker-compose.yml preenchidos na mesma pasta do seu projeto (sugiro na pasta raiz ou numa pasta "docker")
- não se esqueça de copíar o application.properties também para a pasta src/main/resources do seu projeto
- executa na linha de comando docker-compose up ou docker-compose up -d (necessário já ter o Docker Engine ou Docker Desktop instalado na sua máquina)

### Antes de usar, segue alguns avisos e disclaimers:

- As configs geradas são úteis em ambiente de desenvolvimento. Não as utilize para setups de produção!
- Sim, eu sei que o código interno do gerador não está bonito =D
- Fazer a geração das configurações com código server-side? Quem sabe um dia....
- Melhorar o layout? Seria bom... ajuda nóis ae!!!
- Até o momento só testei com o Chrome....
