from jmd_imagescraper.core import * # dont't worry, it's designed to work with import *
from pathlib import Path
NUM_CLUSTERS = 4
import numpy as np
import scipy
from scipy import cluster
from wordfreq import top_n_list
from PIL import Image
import requests
from io import BytesIO
import binascii
import json
from tqdm import tqdm
import time
import argparse
from colorthief import ColorThief
import random


def duckduckgo_search_urls(keywords, max_results=10, 
                           img_size: ImgSize=ImgSize.Cached,
                           img_type: ImgType=ImgType.Photo,
                           img_layout: ImgLayout=ImgLayout.Square,
                           img_color: ImgColor=ImgColor.All,):
    return duckduckgo_scrape_urls(keywords,max_results,img_size,img_type,img_layout,img_color)

def median_centroid(ar,NUM_CLUSTERS=4):
    codes, dist = cluster.vq.kmeans(ar, NUM_CLUSTERS)
    vecs, dist = cluster.vq.vq(ar, codes)         # assign codes
    counts, bins = np.histogram(vecs, len(codes))    # count occurrences
    # index_max = np.argmax(counts)                    # find most frequent
    
    second_idx,first_idx = np.argsort(counts)[-2:]
    second_color,first_color = codes[second_idx],codes[first_idx]
    second_sta,first_sta = rgb_to_saturation(second_color),rgb_to_saturation(first_color)
    if second_sta>first_sta:
        return second_color
    else:
        return first_color
    
def rgb_to_saturation(ar): 
    # R, G, B values are divided by 255 
    # to change the range from 0..255 to 0..1: 
    r, g, b =ar 
  
    # h, s, v = hue, saturation, value 
    cmax = max(r, g, b)    # maximum of r, g, b 
    cmin = min(r, g, b)    # minimum of r, g, b 
    diff = cmax-cmin       # diff of cmax and cmin. 
  
    # if cmax and cmax are equal then h = 0 
    if cmax == cmin:  
        h = 0
      
    # if cmax equal r then compute h 
    elif cmax == r:  
        h = (60 * ((g - b) / diff) + 360) % 360
  
    # if cmax equal g then compute h 
    elif cmax == g: 
        h = (60 * ((b - r) / diff) + 120) % 360
  
    # if cmax equal b then compute h 
    elif cmax == b: 
        h = (60 * ((r - g) / diff) + 240) % 360
  
    # if cmax equal zero 
    if cmax == 0: 
        s = 0
    else: 
        s = (diff / cmax) * 100
  
    # compute v 
    v = cmax * 100
#     return h, s, v
    return s

def batch(iterable, n=1):
    l = len(iterable)
    for ndx in range(0, l, n):
        yield iterable[ndx:min(ndx + n, l)]

def word_to_color(word):
    links = duckduckgo_search_urls(word)
    colors = []
    for link in links:
        try:
            response = requests.get(link)
            im = Image.open(BytesIO(response.content))
    #         color_thief = ColorThief(BytesIO(response.content))
    #         peak = color_thief.get_color(quality=1)
            im = im.convert('RGB')
            im = im.resize((100, 100))
            ar = np.array(im)
            shape = ar.shape
            # if shape[-1]!=3:
            #     continue
            ar = ar.reshape(np.product(shape[:2]), shape[2]).astype(float)
            peak = median_centroid(ar,NUM_CLUSTERS=5)

            colors.append(peak)
        except:
            pass
#     md = median_centroid(np.array(list(colors)).astype(float),NUM_CLUSTERS=3)
    md = median_centroid(np.array(colors),NUM_CLUSTERS=3)
    color = binascii.hexlify(bytearray(int(c) for c in md)).decode('ascii')
    return color
def word_to_color_thief(word):
    links = duckduckgo_search_urls(word)
    colors = []
    for link in links:
        try:
            response = requests.get(link)
            im = Image.open(BytesIO(response.content))
            color_thief = ColorThief(BytesIO(response.content))
            peak = color_thief.get_color(quality=1)
#             im = im.convert('RGB')
#             im = im.resize((100, 100))
#             ar = np.array(im)
#             shape = ar.shape
#             # if shape[-1]!=3:
#             #     continue
#             ar = ar.reshape(np.product(shape[:2]), shape[2]).astype(float)
#             peak = median_centroid(ar,NUM_CLUSTERS=5)

            colors.append(peak)
        except:
            pass
    md = median_centroid(np.array(list(colors)).astype(float),NUM_CLUSTERS=3)
#     md = median_centroid(np.array(colors),NUM_CLUSTERS=3)
    color = binascii.hexlify(bytearray(int(c) for c in md)).decode('ascii')
    return color

def main():
    top_words = top_n_list('en', 50000)        
    dic = {}
    words_skipped = []
    counter = 0
    for word in tqdm(top_words):
        if counter%50==0:
            with open('data_chinese.json', 'w') as fp:
                json.dump(dic, fp)
            with open('missing_words_chinese.json', 'w') as wp:
                json.dump(words_skipped, wp)
        try:
            dic[word] = '#'+word_to_color(word)
        except:
            print("skip word '{}'".format(word))
            time.sleep(5)
            words_skipped.append(word)
        counter +=1

if __name__ == "__main__":
    main()
