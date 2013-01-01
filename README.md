API Proxy Spike
===============

A spike to implement a proxy for API endpoints with
authentication.
It first goes to an auth server for token verification
and then it proxes to corresponding resource server once
authentication is successful.

Solution
========

It uses [http-proxy](https://github.com/nodejitsu/node-http-proxy)
to proxy requests. Here is the brenchmark:

```
$ ab -H 'Authorization: Bearer 1234' -n 1000 -c 10 http://127.0.0.1:8001/

This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd,
http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 127.0.0.1 (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests

Server Software:        
Server Hostname:        127.0.0.1
Server Port:            8001

Document Path:          /
Document Length:        339 bytes

Concurrency Level:      10
Time taken for tests:   2.239 seconds
Complete requests:      1000
Failed requests:        0
Write errors:           0
Total transferred:      440000 bytes
HTML transferred:       339000 bytes
Requests per second:    446.59 [#/sec] (mean)
Time per request:       22.392 [ms] (mean)
Time per request:       2.239 [ms] (mean, across all concurrent
requests)
Transfer rate:          191.89 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:    10   22  12.6     18      86
Waiting:       10   22  12.6     18      86
Total:         10   22  12.6     18      86

Percentage of the requests served within a certain time (ms)
  50%     18
  66%     23
  75%     26
  80%     28
  90%     39
  95%     45
  98%     74
  99%     84
 100%     86 (longest request)
```
