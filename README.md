# cloud-function-zip-gcs
A code example of how you can use Cloud Functions ( underlying powered by Cloud Run and therefore can also use Cloud Run ) to go through contents of a Google Cloud Storage (GCS) bucket, retrieve them and then zip up the entire content into a zip file to present for the user to download.

The overall steps in this workload is:

1. Specify a GCS bucket or folder
2. Download all files in the bucket or folder
3. Add files to a zip file
4. Upload the zip file back to the same GCS bucket (you can change the destination bucket if you want)
5. Give the user the link to download the zip file from the GCS bucket

Because we are downloading files into memory first, this particular example works best for small file sizes. If the files in the GCS buckets are very large, you likely need some other implementation where you download the files to disk temporarily first.
