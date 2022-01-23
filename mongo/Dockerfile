FROM mongo
 # Will be set through Environment Files

RUN mkdir -p /usr/src/data
WORKDIR /usr/src/data

COPY mongo /usr/src/data

CMD mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection categorias --file /usr/src/data/categorias.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection contactos --file /usr/src/data/contactos.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection documentos --file /usr/src/data/documentos.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection equipas --file /usr/src/data/equipas.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection medicos --file /usr/src/data/medicos.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection noticias --file /usr/src/data/noticias.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection consultas --file /usr/src/data/pedidoC.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection medicacaos --file /usr/src/data/pedidoM.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection sugestaos --file /usr/src/data/sugestoes.json --type json --jsonArray && \
mongoimport --uri mongodb://usf-mongo:27017/USF_PORTAL_UTENTE --collection users --file /usr/src/data/users.json --type json --jsonArray 