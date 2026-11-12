import json,urllib.request,urllib.parse,time,re,html
UA={'User-Agent':'bakahan-site-photo-research/0.1 (static site)'}
def get(u):
    for a in range(6):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code==429: time.sleep(6*(a+1)); continue
            raise
PICKS={
 'hero-brahman-lipa':'Brahman cattle near Lipa, Batangas, Philippines (2025).jpg',
 'farm-borongan':'A cattle farm in Borongan City, Eastern Samar.jpg',
 'cow-catanduanes':'A cow gazes upon the scenery at Hiyop Point, Catanduanes.jpg',
 'brahman-taal':'Cow with rope..Taal Volcano, Philippines - panoramio.jpg',
 'cow-bohol-tethered':'White cow baka at Bohol 2017.jpg',
 'farmers-rice-straw':'Rice farmers at work in the Philippines.jpg',
 'brahman-drinking':'Brahman bull 1 (15103719455).jpg',
 'brahman-bulls-paddock':'Brahman bulls.jpg',
 'kabakahan-arch':'Kabakahan Festival 2024 Arch, Padre Garcia, Batangas, Aug 2025.jpg',
 'farmer-bohol':'A farmer woman in the middle of her rice fields in Bohol - Philippines.jpg',
 'native-cow':'Baka (Filipino breed of cow) resting (2004).jpg',
 'brahman-grey-bull':'CSIRO ScienceImage 2643 A Brahman Bull.jpg',
 'maize-silage':'Maize silage.JPG',
}
p={'action':'query','format':'json','titles':'|'.join('File:'+t for t in PICKS.values()),'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':2000}
d=json.loads(get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)))
norm={n['to']:n['from'] for n in d['query'].get('normalized',[])}
info={}
for pg in d['query']['pages'].values():
    t=norm.get(pg['title'],pg['title'])[5:]; ii=pg['imageinfo'][0]; m=ii['extmetadata']
    clean=lambda k: re.sub(r'\s+',' ',re.sub('<[^>]+>','',html.unescape(m.get(k,{}).get('value','')))).strip()
    info[t]={'thumb':ii.get('thumburl',ii['url']),'page':ii['descriptionurl'],'artist':clean('Artist'),'license':clean('LicenseShortName'),'licenseUrl':clean('LicenseUrl'),'credit':clean('Credit')[:120]}
meta={}
for key,t in PICKS.items():
    i=info[t]; open(f'orig/{key}.jpg','wb').write(get(i['thumb'])); time.sleep(2)
    meta[key]={'title':t,**{k:v for k,v in i.items() if k!='thumb'}}
    print(key,'|',i['license'],'|',i['artist'][:40])
json.dump(meta,open('credits.json','w'),indent=1,ensure_ascii=False)
