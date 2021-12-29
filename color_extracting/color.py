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
import random


def duckduckgo_search_urls(keywords, max_results=10, 
                           img_size: ImgSize=ImgSize.Cached,
                           img_type: ImgType=ImgType.Photo,
                           img_layout: ImgLayout=ImgLayout.All,
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
    r, g, b =ar 
    cmax = max(r, g, b)    # maximum of r, g, b 
    cmin = min(r, g, b)    # minimum of r, g, b 
    diff = cmax-cmin       # diff of cmax and cmin. 
    if cmax == cmin:  
        h = 0
    elif cmax == r:  
        h = (60 * ((g - b) / diff) + 360) % 360
    elif cmax == g: 
        h = (60 * ((b - r) / diff) + 120) % 360
    elif cmax == b: 
        h = (60 * ((r - g) / diff) + 240) % 360
    if cmax == 0: 
        s = 0
    else: 
        s = (diff / cmax) * 100
    v = cmax * 100
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
            im = im.convert('RGB')
            im = im.resize((100, 100))
            ar = np.array(im)
            shape = ar.shape
            ar = ar.reshape(np.product(shape[:2]), shape[2]).astype(float)
            peak = median_centroid(ar,NUM_CLUSTERS=5)
            colors.append(peak)
        except:
            pass
    md = median_centroid(np.array(colors),NUM_CLUSTERS=3)
    color = binascii.hexlify(bytearray(int(c) for c in md)).decode('ascii')
    return color,np.trace(np.cov(np.stack(colors).T/255)**2)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--language', type=str, default='en', help='learning rate')
    parser.add_argument('--n', type=int, default=50000, help='learning rate')
    args = parser.parse_args()
    
    language=args.language
    n = args.n
    
    top_words = top_n_list(language, n)        
    dic = {}
    dic_cov = {}
    words_skipped = []
    counter = 0
    for word in tqdm(top_words):
        if counter%50==0:
            with open('data_words_{}.json'.format(language), 'w') as fp:
                json.dump(dic, fp)
            with open('data_cov_{}.json'.format(language), 'w') as fp:
                json.dump(dic_cov, fp)
            with open('missing_words_{}.json'.format(language), 'w') as wp:
                json.dump(words_skipped, wp)
        try:
            color_hex,cov = word_to_color(word)
            dic[word] = '#'+color_hex
            dic_cov[word] = cov
        except:
            print("skip word '{}'".format(word))
            time.sleep(1)
            words_skipped.append(word)
        counter +=1

if __name__ == "__main__":
    main()
