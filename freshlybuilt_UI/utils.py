from freshlybuiltimagebol import ImageProcess
from freshlybuiltimagebol import ShabdDhwani
from cv2 import imread,imwrite
from os.path import join
scanned_image_path=join('static','image','scanned')
uploaded_image_path=join('static','image','uploads')
audio_files_path=join('static','audio')
def preprocess(imgname):
    '''
    preprocess image before text extraction
    '''
    image_path=uploaded_image_path+"/"+imgname
    image=imread(image_path)
    skew=ImageProcess.remove_skew(image)
    sharpen=ImageProcess.sharpness_blur(skew)
    img=ImageProcess.remove_noise(sharpen)
    imwrite(join(scanned_image_path,imgname),img)
    return join(scanned_image_path,imgname)


def convert_audio(imgname,language='english'):
    '''
    extract text from scanned image and
    translate and convert text to audio
    '''
    image_path=scanned_image_path+"/"+imgname
    image=imread(image_path)
    text=ImageProcess.to_text(image)
    audio_file_name=imgname.split('.')[0]+"_"+language+".mp3"
    ShabdDhwani.shabd_se_dhwani(text,language,audio_files_path+"/"+audio_file_name)
    return audio_file_name
    
