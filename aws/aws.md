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

S3 is Amazon's cloud-storage solution. S3 is similar to Dropbox or Google Drive in concept, but it is especially geared towards serving static files on the web. This is great for ho

## EC2

EC2 is Amazon's service for virtual private servers. These are computers which are actually running as programs in a so-called "host operating system" running virtualization software (which sounds really slow, but works quite well in practice.) The computers are called instances in Amazon's parlance, and they come in several types. For this lab you'll be using the standard small instance, `m1.small`, which costs $0.06 per hour.

The first thing you'll do is set up the operating system. You'll be using Ubuntu server edition, but a particular "image" rather than the standard install you would get if you put Ubuntu on a machine with a CD. There are many images out there, but you'll use one that comes with Node pre-installed.

The image is [BitNami Node.js Stack](https://aws.amazon.com/amis/bitnami-node-js-stack-0-8-15-1-64-bit-ubuntu-12-04). You can open this up and click "Launch instance," choose "US East." If that doesn't work, make sure you're signed in to your AWS account.

This should bring up the configuration dialog for a new instance. You'll have to go through a couple steps to start it up:

* Everything default under "Advanced Instance Options," "Storage Device Configuration," and "Tags."
* Under "Create Key Pair" choose "Create new key pair." Name it whatever you want and download the key (it should be a .pem file.) This is the key which will allow you to log in via SSH.
* `chmod 600 /path/to/key.pem` (This is important: it sets the permissions of the keyfile so that only you can read it.)
* Under "Configure Firewall" choose "Create a new Security Group" (again, name it whatever you like.) By default Amazon will block all inbound traffic to your instance, so you need to allow SSH, HTTP, and ping.
* Add the following rules to the security group:
	* Allow inbound SSH from `0.0.0.0/0`
	* Allow inbound HTTP from `0.0.0.0/0`
	* Allow inbound "Custom ICMP" / "Echo Request" from `0.0.0.0/0`
* Launch it, and hit "View your instances on the instances page." It may take a few minutes to start.

Now you should see the list of instances you own (which should be 1). You can give the server you just started a name. Wait for it to turn to the green "running" state and click on the entry to bring up details. You should see a bunch of data about the new instance, and most importantly the subtitle, which has the address of the machine. It should look something like this:

`ec2-184-72-92-237.compute-1.amazonaws.com`

Now ping your machine to make sure it's online:

```
$ ping -c 8 ec2-184-72-92-237.compute-1.amazonaws.com
PING ec2-184-72-92-237.compute-1.amazonaws.com (184.72.92.237): 56 data bytes
64 bytes from 184.72.92.237: icmp_seq=0 ttl=46 time=36.297 ms
64 bytes from 184.72.92.237: icmp_seq=1 ttl=46 time=79.169 ms
64 bytes from 184.72.92.237: icmp_seq=2 ttl=46 time=97.833 ms
64 bytes from 184.72.92.237: icmp_seq=3 ttl=46 time=38.458 ms
64 bytes from 184.72.92.237: icmp_seq=4 ttl=46 time=83.599 ms
64 bytes from 184.72.92.237: icmp_seq=5 ttl=46 time=72.363 ms
64 bytes from 184.72.92.237: icmp_seq=6 ttl=46 time=172.429 ms
64 bytes from 184.72.92.237: icmp_seq=7 ttl=46 time=74.162 ms

--- ec2-184-72-92-237.compute-1.amazonaws.com ping statistics ---
8 packets transmitted, 8 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 36.297/81.789/172.429/39.650 ms
```

If that worked, congratulations! You've successfully started your own server. (Remember to stop it! We'll cover that later.)

In order to access your machine you'll SSH in with the key you downloaded earlier. Run the following command, replacing the key path and the address of the machine (the stuff that comes after the @).

`ssh -i ~/some/path/to/key.pem bitnami@ec2-184-72-92-237.compute-1.amazonaws.com`

If you get a complaint about permissions here it's because you didn't chmod the key file.

You should now have a shell, something like:

`bitnami@domU-12-31-39-0A-A4-41:~$`

Now you're going to set up a very simple application on the server.

First we have to shut down redis and Apache, which come preinstalled and are already running. To do so, run the following commands:

```
cd ~/stack
sudo ./ctlscript.sh stop redis
sudo ./ctlscript.sh stop apache
```

Now we're going to make a new application, called `project`:
```
#Go to your home directory
cd ~
#And make a new folder
mkdir project
#And go into it.
cd project
#Install forever and express (two libraries for Node).
npm install forever
npm install express
#This is a nice little tool which comes with express to set up
#a basic application.
#You can ignore warnings about the directory not being empty.
./node_modules/express/bin/express .
```

Now edit the `package.json` file appropriately. If you don't have a preferred editor you can use:

`nano package.json`

`Ctrl-O` will write the file and `Ctrl-X` will quit.

Now `npm install` to install the packages listed in your `package.json`.

Finally, you should be able to run your application:

`sudo PORT=80 node app.js`

`sudo` runs the command as the root user, which is needed because it's using a port number less than 1024. PORT=80 sets an environment variable which is used on line 14 of `app.js` to set the port that the server runs on.

Now if you put your machine's address (like `ec2-184-72-92-237.compute-1.amazonaws.com`) into your browser you should see a "Welcome to Express!" page.


John: do you think we should cover starting/running this with an init.d script?

sudo nano /etc/init.d/project
paste contents of project
sudo chmod a+x /etc/init.d/project
sudo update-rc.d project defaults

sudo /etc/init.d/project start
tail -f /var/log/project.log
sudo /etc/init.d/project stop
