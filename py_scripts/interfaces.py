#!python3
#coding=UTF-8

import sys
import os
import json
import netifaces

a = []
x = netifaces.interfaces()
default_gate = netifaces.gateways()['default'][netifaces.AF_INET][1] or "0x00" 

for i in x:
    if i != 'lo':
        mac = netifaces.ifaddresses(i)[netifaces.AF_LINK][0]['addr'] or "0x00"; 
        interface = i or "0x00"
        
        strg2= ('{ "mac": "' + mac + '", "interface": "' + interface + '" }')
        a.append(strg2)
        i += i
    else:
        continue

res = {
    "default_interface": default_gate,
    "interfaces": a
}
print(json.dumps(res))