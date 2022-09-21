# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import pickle
import shutil
import threading

from random import randrange

from django.http import HttpResponse
from django.core import mail

from rest_framework.response import Response
from rest_framework.views import APIView
from email.mime.application import MIMEApplication

import api.data_manipulation.similarity_analysedocs as similarity_analyse_docs
import api.data_manipulation.textdata as text_data
import api.pdf_generator.pdf as pdf_generator


def generate_pdf_function_send_email(data, email):
    id_temp = str(randrange(9999))

    pdf_generator.generate_pdf(data, id_temp)
    pdf_generator.generate_zip(id_temp)

    #     send EMAIL
    send_email_function(email, id_temp)

    pdf_generator.temppdf_delete(id_temp)
    pdf_generator.relatoriozip_delete(id_temp)


def send_email_function(email, id_temp):
    subject = 'Resultado da Análise dos arquivos'
    content = 'Segue em anexo o resultado da sua análise'
    from_email = 'detectorplagioemail@gmail.com'
    target = [
        email
    ]

    attachmentsl = []
    path_relatorio = "api/analyses/analyse_result_report/relatorio" + id_temp + ".zip"
    with open(path_relatorio, 'rb') as file:
        attachmentsl.append(MIMEApplication(file.read(), Name='relatorio.zip'))

    msg = mail.EmailMessage(subject, content,
                            to=target, from_email=from_email, attachments=attachmentsl)
    msg.send()


def send_email_function_error(email):
    subject = 'Resultado da Análise dos arquivos'
    content = 'Ocorreu um erro ao analisar seus arquivos!'
    from_email = 'detectorplagioapp@gmail.com'
    target = [
        email
    ]

    msg = mail.EmailMessage(subject, content,
                            to=target, from_email=from_email)
    msg.send()


def delete_flags(id_analyse):
    folder = "api/analyses/analyse_flags/" + id_analyse
    if os.path.exists(folder):
        try:
            shutil.rmtree(folder)
        except Exception as e:
            print('Failed to delete Reason:', e)

def delete_files(id_analyse):
    folder = "api/analyses/analyse_files/" + id_analyse
    if os.path.exists(folder):
        try:
            shutil.rmtree(folder)
        except Exception as e:
            print('Failed to delete Reason:', e)


class CalculateSimilarity(APIView):
    def post(self, request, format=None):
        # Not remove variable data (cause heroku error!):
        data = request.data
        id_analyse = data["id_analyse"]
        type_analyse = data["type_analyse"]
        dir_id_analyse = "api/analyses/analyse_flags/" + id_analyse
        dir_analyse_files = "api/analyses/analyse_files/" + id_analyse
        email = data["email"]
        len_files = int(data["len_files"])

        if not os.path.exists(dir_id_analyse):
            os.makedirs(dir_id_analyse)

        # cria o lock da task executando:
        if not os.path.exists(dir_id_analyse + "/processing-lock.txt"):
            with open(dir_id_analyse + "/processing-lock.txt", "w") as f:
                f.write(str(0))
                f.close()

            data = request.data
            dits = dict(data.lists())
            files = dits.get('file')

            #sSalva os arquivos em binário para serem recuperados posteriormente
            for file in files:
                if not os.path.exists(dir_analyse_files):
                    os.makedirs(dir_analyse_files)
                with open(dir_analyse_files + '/' + file.name, 'wb') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)


            # inicia a thread
            thread_long = ThreadLong(dir_analyse_files=dir_analyse_files, dir_id_analyse=dir_id_analyse,
                                     type_analyse=type_analyse,
                                     email=email)
            thread_long.start()

            # se ainda nao terminou de processar
            if not os.path.exists(dir_id_analyse + "/result_analyse.dictionary"):
                with open(dir_id_analyse + '/processing-lock.txt', 'rb') as f:
                    data_file = int(f.read())
                    calc = data_file / len_files
                    f.close()
                return Response(calc)
            else:
                # Show Info:
                with open(dir_id_analyse + '/result_analyse.dictionary', 'rb') as config_dictionary_file:
                    config_dictionary = pickle.load(config_dictionary_file)

                delete_flags(id_analyse)
                delete_files(id_analyse)
                return Response(config_dictionary)
        else:
            if not os.path.exists(dir_id_analyse + "/result_analyse.dictionary"):
                with open(dir_id_analyse + '/processing-lock.txt', 'rb') as f:
                    data_file = int(f.read())
                    calc = data_file / len_files
                    f.close()

                return Response(calc)
            else:
                # Show Info:
                with open(dir_id_analyse + '/result_analyse.dictionary', 'rb') as config_dictionary_file:
                    config_dictionary = pickle.load(config_dictionary_file)

                delete_flags(id_analyse)
                delete_files(id_analyse)
                return Response(config_dictionary)


class GeneratePDF(APIView):
    def post(self, request, format=None):
        data = request.data
        # Gera arquivos PDFs
        id_temp = str(randrange(9999))
        pdf_generator.generate_pdf(data, id_temp)
        pdf_generator.generate_zip(id_temp)
        relatorio_path = "api/analyses/analyse_result_report/relatorio" + id_temp + ".zip"
        relatorio_file = open(relatorio_path, 'rb').read()
        response = HttpResponse(relatorio_file, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="relatorio.zip"'

        pdf_generator.temppdf_delete(id_temp)
        pdf_generator.relatoriozip_delete(id_temp)

        return response


class GeneratePDFEmailError(APIView):
    def post(self, request, format=None):
        data = request.data
        email = data[0]["email"]
        send_email_function_error(email)
        return Response("error")


class CleanFiles(APIView):
    def post(self, request, format=None):
        data = request.data
        if len(data) > 0:
            id_analyse = data["id_analyse"]
            delete_flags(id_analyse)
            delete_files(id_analyse)
        return Response("ok")


class ThreadLong(threading.Thread):
    def __init__(self, group=None, target=None, dir_analyse_files=None, dir_id_analyse=None, type_analyse=None,
                 email=None,
                 args=(), kwargs=None, verbose=None):
        super(ThreadLong, self).__init__()
        self.target = target
        self.dir_id_analyse = dir_id_analyse
        self.dir_analyse_files = dir_analyse_files
        self.type_analyse = type_analyse
        self.email = email

    def run(self):
        # executa a analise

        data = text_data.get_info_from_files(self.dir_analyse_files)
        result_analyse = similarity_analyse_docs.calculate_similarity_function(data, self.dir_id_analyse,
                                                                               self.type_analyse)
        # Save info e gera flag de conclusão
        with open(self.dir_id_analyse + '/result_analyse.dictionary', 'wb') as config_dictionary_file:
            pickle.dump(result_analyse, config_dictionary_file)
        # envia email
        if len(self.email) > 0:
            generate_pdf_function_send_email(result_analyse, self.email)


class Example01(APIView):
    def get(self, request, format=None):
        with open('api/examples/example01/example01-result_analyse.dictionary', 'rb') as config_dictionary_file:
            config_dictionary = pickle.load(config_dictionary_file)

        return Response(config_dictionary)


class Example02(APIView):
    def get(self, request, format=None):
        with open('api/examples/example02/example02-result_analyse.dictionary', 'rb') as config_dictionary_file:
            config_dictionary = pickle.load(config_dictionary_file)

        return Response(config_dictionary)
