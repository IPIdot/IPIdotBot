import requests
from bs4 import BeautifulSoup

url = 'https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&Tel=antoine.bouard&date=10/15/2020'

responce=requests.get(url)

soup =BeautifulSoup(responce.text,'lxml')
teams = soup.findAll('div')
print(teams)
