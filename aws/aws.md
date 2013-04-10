# CS132 Lab Four: AWS

## AWS
Amazon Web Services, or AWS, is a suite of cloud services provided by Amazon. AWS provide tools for computing, storage, databases, management and more. The services are designed to be massively scalable, so they work well for small projects but can support huge sites as well. In CS132 we will be using EC2 to run our server and S3 to serve static content.

## *Disclaimer*
> While Amazon offers a free tier of some of the AWS services as a trial, most
> usages incur some cost. Amazon has been generous enought to provide a $100
> grant for you to use this semester. This should be ample to cover any
> reasonable usage of AWS during the course, but please be cautious! As this
> grant is to you personally, *you* will be responsible for any additional
> charges, and not Brown CS. Monitor your usage and you should be fine. We
> recommend you set up alerts to warn you about your usage.

## Setting up AWS
Go to [AWS](http://aws.amazon.com "Amazon Web Services") and click the **Sign Up** button in the header. Either login with your existing Amazon account if you have one, or create a new one.
Amazon has given you all $100 credits for EC2. Please read the instructions to
access this credit (come to the front of the lab to get your code). Be sure to
read the terms of service! There are restrictions to what the credit can be put 
towards. [Claim your credit](http://aws.amazon.com/awscredits/)

### AWS Console
Take a look at the AWS [console](http://console.aws.amazon.com/console/home "AWS console"). From the homepage the console can be reached by clicking **My Account/Console > AWS Management Console** in the header. Take a second to check out some of the other services offered.

## S3

S3 is Amazon's cloud-storage solution. S3 is similar to Dropbox or Google Drive
in concept, but it is especially geared towards serving static files on the web.
This is great for hosting static resources such as images, javascript, css or static
html pages. While you can serve static content via express (or another
framework) S3 is generally faster. 

## EC2

EC2 is Amazon's cloud-server solution. EC2 lets you run virtual machines on
Amazon's cloud which we'll be using to host a simple node.js server. AWS makes
it easy to scale instances or fire up new ones. We won't need to do that right
now, but it's nice to have the option. This scalability is one of the things that makes EC2
so popular.
 
## Getting started with S3

Go to your AWS console and click on S3. You should see a big blue button in the
upper left that says, "Create Bucket". "Buckets" are just top level folders in
S3, but they have to be unique across all S3 buckets, so click the button and
create a new one. Name it something like "yourlogin-cs132lab". Leave the region
as US Standard and ignore logging for now (it can always be turned on later).

You should see your new bucket in the bucket list (tee-hee). If select your
bucket and click properties on the right side you should see the details of the
bucket as well as several option tabs.  Click around and look at the different
options available. We're interested in 'Static Website Hosting'. Click to enable
website hosting, we'll fill in the details later.

Now click on your bucket name to go into your bucket. Inside a bucket you can
upload and manage files as well as create folders. Upload an image to your
bucket. Feel free to use this as your image if you're not feeling creative:
[JB](http://www.aceshowbiz.com/images/wennpic/justin-bieber-40th-anniversary-american-music-awards-06.jpg)

You can right click on the filename to rename it if you like. Now create a
simple html page with a title and an image tag. The image tag should have your
image name as the source like so:

    <img src="/jb.jpg"></img>

When you're done, upload this html file to your bucket. Since you uploaded
this to the same directory as image, you can use a relative path to your image
like above.

Now, select both your files by checking the box to the left of each and right
click one of them. You should see the option to "Make Public" which will allow
others to access these files. Go ahead and do that.

Click 'All Buckets' in the upper left to go back to your bucket list. Now fill
in the 'Index Document' field in the Static Website Hosting option with the name
of your html file. Now if you click the endpoint you should see your static
site! That's all there is to it. 
