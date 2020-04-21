import ifcfg
import os
import json
from scapy.all import *

def sniff_ap(pkt):
    if pkt.haslayer(Dot11):
        if pkt.add3 == 'xx.xx.xx.xx.xx.xx':  ## AP MAC
            print(pkt.summary())
        else: pass
    else: pass

sniff(prn=sniff_ap)