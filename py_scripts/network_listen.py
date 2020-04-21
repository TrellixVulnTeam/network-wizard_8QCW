import ifcfg
import os
import json
import sys
import importlib
import subprocess
from subprocess import Popen, PIPE

output = None
mac = None
channel = None

def run(command):
    process = Popen(command, stdout=PIPE, shell=True)
    while True:
        line = process.stdout.readline().rstrip()
        if not line:
            break
        yield line

def isMAC48Address(inputString):
    if inputString.count(":")!=5:
        return False
    for i in inputString.split(":"):
        for j in i:
            if j>"F" or (j<"A" and not j.isdigit()) or len(i)!=2:
                return False
    return True 


try:
    if (isMAC48Address(sys.argv[1]) & sys.argv[2].isdigit()):
        mac = sys.argv[1]
        channel = sys.argv[2]
        interface = sys.argv[3]

        cmd = ('sudo airodump-ng  --background 0 -c ' + channel + ' --bssid ' + mac + ' ' + interface)
        for path in run(cmd):
            print(json.dumps(path))

        sys.stdout.flush()
    else:
        output = {
        "error": 100,
        "data": None
        }
except Exception:
    output = {
        "error": 200,
        "data": None
    }


print(json.dumps(output))


# ERROR CODES :
# 100 => Not valid values // Check conditional failed
# 200 => Not received MAC // Exception
