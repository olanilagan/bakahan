import numpy as np, sys, os
from PIL import Image, ImageOps
SH=np.array([20,56,34])/255.0     # --green-900: shadow tint
HI=np.array([248,236,208])/255.0  # straw-cream: highlight tint
def grade(im):
    a=np.asarray(im.convert('RGB')).astype(np.float32)/255.0
    L=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]
    a=L+(a-L)*0.86                                  # gentle desaturation
    a=a+(SH-a)*(0.22*(1-L)**2)                      # green-tinted shadows
    a=a+(HI-a)*(0.12*L**2)                          # warm highlights
    a=np.clip(a,0,1)**0.97                          # slight lift
    a=np.clip((a-0.5)*1.04+0.5,0,1)                 # touch of contrast
    return Image.fromarray((a*255+0.5).astype(np.uint8))
def crop(im,ratio):
    w,h=im.size
    if abs(w/h-ratio)<0.02: return im
    return ImageOps.fit(im,(w,int(w/ratio)) if w/h<ratio else (int(h*ratio),h),centering=(0.5,0.45))
# per-photo crop ratio (3:2 default; hero keeps 3:2; tall/square sources fit to 3:2)
for f in sorted(os.listdir('orig')):
    key=f[:-4]; im=Image.open('orig/'+f); im=ImageOps.exif_transpose(im)
    im=grade(crop(im,3/2))
    for w in (1600,800):
        x=im.copy(); x.thumbnail((w,w)); x.save(f'out/{key}-{w}.webp','WEBP',quality=76,method=6)
    print(key, im.size, os.path.getsize(f'out/{key}-1600.webp')//1024,'KB /',os.path.getsize(f'out/{key}-800.webp')//1024,'KB')
