# Swagger configuration file sample

## Metadata

- openapi: especifica a versao do swagger (3.0.3)
- info: contem as descricoes da API

  - title (string): titulo da API
  - version (string): versao da api
  - description (string): descricao da api
  - contact: informacoes de contacto
    - name (string): nome do responsavel
    - email (string): email do responsavel
    - website (string): website do responsavel

- servers ([objctos]): especifica as URLs base da API num objecto com as propriedades `url` e `description`
- paths: configura as rotas da API. E um objecto de objectos

  - path: e o endpoint da API
    - method: configura o comportamento de um metodo especifico para `path`
      - tags (array): define o nome do grupo a que `path` pertence
      - summary: resumo do endpoint
      - description: descricao detalhada da endpoint
      - response: configura o formato da response
        - code: configura a response para cada o codigo especifico
          - description: descreve o tipo de response
          - content: configura o conteudo da response
            - media-type: define o tipo de response (ou request). [
              multipart/form-data,
              applicaiton/json,
              application/pdf,
              etc
              ]
              - schema: define o tipo de esquema usado
                - type: define o tipo de dado do esquema
                - items: configura os items da response
                  - type: tipo de dado do item
                  - $ref: referencia a um esquema existente

- components: define um conjunto de modelos
  - schemas: define os modelos da API
    - model: cria um modelo
      - type: define o tipo de dado do modelo
      - properties: define as propriedades do modelo
