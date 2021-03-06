from flask import Flask, render_template,request,redirect,url_for,jsonify,json,flash
import os,secrets
from utils import preprocess,convert_audio
from freshlybuiltimagebol import bhasha_codes,ShabdDhwani
from werkzeug.utils import secure_filename
from pdf2image import convert_from_path


app=Flask(__name__)

app.config['ALLOWED_IMAGE_EXTENSIONS']=['PNG','JPG','JPEG','GIF']

app.config["UPLOADED_PHOTOS_PATH"]=os.path.join('static','image','uploads')
app.config["AUDIO_FILES"]=os.path.join('static','audio')
app.config["UPLOADED_PDF_PATH"]=os.path.join('static','pdf')

@app.route('/home')
@app.route("/", methods=["GET","POST"])
def home():
	'''
	renders ImageBol template
	'''
	languages=bhasha_codes.bhasha_kosh.values()
	return render_template('ImageBol.html',languages=languages)

@app.route("/About")
def about():
	'''
	renders AboutUs template
	'''
	return render_template('AboutUs.html')


def allowed_image(imgname):
	'''
	checks if the image extension is allowed or not
	'''
	if not '.' in imgname:
		return False
	ext=imgname.split('.')[-1]
	if ext.upper() in app.config['ALLOWED_IMAGE_EXTENSIONS']:
		return True
	else:
		return False


@app.route("/upload-image", methods=["POST"])
def upload_image():
	'''
	extracts text from image and convert text to audio and 
	return scanned image name and audio file name in json format
	'''
	if request.method == "POST":
		if request.files:
			image = request.files["original-image"]
			if image.filename=="":
				flash('Image must have a filename!!')
			if not allowed_image(image.filename):
				flash('File not supported!!')
			language = request.form.get('languages')
			ext=image.filename.split('.')[-1]
			imgname=secrets.token_hex(10)+'.'+ext
			img_save_path=os.path.join(app.config["UPLOADED_PHOTOS_PATH"],imgname)
			image.save(img_save_path)
			preprocess(imgname)
			text,audio_file=convert_audio(imgname,language)
			return jsonify({'image':imgname,'text':text,'audio' : audio_file})

		return jsonify({'error' : 'Something went wrong!!'})



@app.route('/text-bol')
def textbol():
	'''
	renders TextBol template
	'''
	languages=bhasha_codes.bhasha_kosh.values()
	return render_template('TextBol.html',languages=languages)

@app.route('/text-convert',methods=["POST","GET"])
def text_convert():
	'''
	translate and convert text to audio file and 
	returns the audio file name in json format
	'''
	if request.method=='POST':
		text=request.form['text']
		language = request.form.get('languages')
		audio_file_name=secrets.token_hex(10)+'.mp3'
		ShabdDhwani.shabd_se_dhwani(text,language,app.config["AUDIO_FILES"]+"/"+audio_file_name)
		return jsonify({'audio' : audio_file_name})
	return jsonify({'error': 'Something went wrong!!!'})

@app.route('/pdf-bol')
def pdfbol():
	'''
	renders PdfBol template
	'''
	languages=bhasha_codes.bhasha_kosh.values()
	return render_template('PdfBol.html',languages=languages)

@app.route("/pdf-convert", methods=["POST"])
def pdf_convert():
	'''
	extract current pagr from pdf in image format and 
	extract text from image and translate and 
	convert the text to audio file and 
	returns the audio file name in json format
	'''
	if request.method == "POST":
		if request.files:
			pdf = request.files["pdf-file"]
			if pdf.filename=="":
				flash('Image must have a filename!!')
			pdfname=secrets.token_hex(10)+'.pdf'

			pdf_save_path=os.path.join(app.config["UPLOADED_PDF_PATH"],pdfname)
			pdf.save(pdf_save_path)
			language = request.form.get('languages')
			page=request.form['page']
			imgname=secrets.token_hex(10)+'.png'
			img_save_path=os.path.join(app.config["UPLOADED_PHOTOS_PATH"],imgname)
			image=convert_from_path(pdf_save_path)
			image[int(page)-1].save(img_save_path)
			preprocess(imgname)
			text,audio_file=convert_audio(imgname,language)
			return jsonify({'text':text,'audio' : audio_file})

		return jsonify({'error' : 'Something went wrong!!'})

	

app.run(debug=True)
