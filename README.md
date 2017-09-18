# 0xFEEDFACE

### Note about java executables
We distribute a binary in "xcelreader/out/artifacts/xcelreader\_jar/". The binary is built for Ubuntu 16.04. If you want to run on a different OS you will
need to rebuild the binary.

# How to test
There are two ways to test this code. First, you could test the code locally,
but this requires nodejs on your system. The easiest way is to just use the 
development website that we set up.

## Testing locally
You must have nodejs installed. This is only tested on Ubuntu. All commands
should be run in EALSurfer/. Once you have nodejs installed you also need to install the requirements...
```shell  
npm-install EALSurfer/package.json
```

### Prepare your path
```shell 
export PORT=5000
```

1. Start the server.
```shell 
nodejs app.js
```

2. Visit the website at [localhost:5000](http://localhost:5000).

3. Fill out the form.

4. Submit the form.

5. Download the resulting PDF.

6. Profit!

## Or just do it the easy way...
1. Visit our site at [https://hacc2017-bbarcelona.c9users.io/](https://hacc2017-bbarcelona.c9users.io/)

2. Fill out the form.

4. Submit the form.

5. Download the PDF.

6. Profit!

