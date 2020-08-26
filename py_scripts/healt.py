#!/usr/bin/env python

# Purpose - To Gather HP Proliant Firmware Details using ILO4
# Amit Biyani - Aug 15, 2016

import hpilo
import json
import sys
import argparse


def connect(host, user, pwd):
    if not (host or user or pwd):
        print("Could not connect! Parameters were not all provided")
    ilo = hpilo.Ilo(host, login=user, password=pwd, timeout=120,
                    port=443)
    return ilo


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='=> Get HP Proliant Servers \
                                     Firmware Details')
    parser.add_argument('-l', '--login', action='store', help='',
                        dest='ilo_user', required=True)
    parser.add_argument('-p', '--password', action='store', help='',
                        dest='ilo_pass', required=True)
    parser.add_argument('-s', '--serverilo', action='store', help='',
                        dest='ilo_host', required=True)
    ilo_cred = parser.parse_args()

    try:
        ilo_conn = connect(ilo_cred.ilo_host, ilo_cred.ilo_user, ilo_cred.ilo_pass)
        fw_info = ilo_conn.get_embedded_health()
    except hpilo.IloLoginFailed:
        print("Login Error Failed")
        sys.exit(1)

    
    print(json.dump(fw_info))
    exit(0)