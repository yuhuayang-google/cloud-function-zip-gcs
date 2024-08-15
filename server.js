const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const JSZip = require('jszip');

// Register an HTTP function with the Functions Framework that will be executed
// when you make an HTTP request to the deployed function's endpoint.
functions.http('zipToGCS', async (req, res) => {

   const storage = new Storage();
   const jszip = new JSZip();

   const identifier = req.query.identifer; //put bucket/folder name here, if zipping folders
    
   async function DLAndZip(identifier) {
      const outputFile = identifier+"/all_files.zip"; //change file name as needed
      const myBucket = storage.bucket('DESTINATION_BUCKET'); //input the destination bucket
      const gBlob = myBucket.file(outputFile);

      const [files] = await myBucket.getFiles({ prefix: identifier });
      for(let i=0;i<files.length;i++) {
         if(files[i].name != outputFile) {
            let fileBuf = await storage.bucket('SOURCE_BUCKET').file(files[i].name).download();
            jszip.file(files[i].name, fileBuf[0]); 
         }
      }

      await (() =>
            new Promise((resolve, reject) => {
             jszip
                .generateNodeStream({type:'nodebuffer',streamFiles:true})
                .pipe(gBlob.createWriteStream())
                .on('finish', function () {
                    // JSZip generates a readable stream with a "end" event,
                    // but is piped here in a writable stream which emits a "finish" event.
                   resolve();
                });
            }))();
    
            return "Completed";

   }

   //call the DLAndZip function
   try {
         const result = await DLAndZip(identifier);
         const url = "https://storage.googleapis.com/"+identifier+"/all_files.zip";
         return res.json({result, url });
      }
   catch(err) {
         return res.json({error: err});
      }
 
   return res.json({error: 'Unexpected call'});
});
