db = new Mongo().getDB(sura);
db.dropDatabase();

db.webpages.insertOne({"id":"editable-page.html","articles":[{"template":"template-10","heading":"Heading Goes Here","subheadings":[],"texts":["Enter text here"],"images":[],"links":[]},{"template":"template-1","heading":"Heading Goes Here","subheadings":[],"texts":["Enter text here"],"images":[],"links":[]}]});