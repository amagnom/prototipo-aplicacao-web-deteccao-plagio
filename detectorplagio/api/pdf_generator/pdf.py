from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.pagesizes import A4
from zipfile import ZipFile

from textwrap import wrap
from os import walk
from math import ceil
import os
import shutil


def generate_pdf(data, id_temp):
    folder_temp_pdf = "api/analyses/analyse_result_report/temppdf" + id_temp + "/"
    temppdf_create(folder_temp_pdf)
    # CADA DOCUMENTO
    for document in data:
        name_of_document_source = document.get('name_file_source')
        relation_files = document.get('relation_files')

        # CRIA DOCUMENTO:
        pre, ext = os.path.splitext(name_of_document_source)
        dest_filename = pre + ".pdf"

        canvas = Canvas(folder_temp_pdf + dest_filename, pagesize=A4)
        pagesize = canvas._pagesize
        page_width = pagesize[0]
        page_height = pagesize[1]

        # CABEÇALHO
        y = 780
        size = 22
        canvas.setFont("Helvetica-Bold", size)

        text = "Relatório"
        text_width = canvas.stringWidth(text)
        xposition = (page_width - text_width) / 2.0
        canvas.drawString(xposition, y, text)
        y = y - (size * 2.5)

        size = 16
        canvas.setFont("Helvetica-Bold", size)
        name_of_document_source = name_of_document_source.split('.', 1)[0]
        text = "Sentenças Similares Documento " + name_of_document_source
        text_width = canvas.stringWidth(text)
        xposition = (page_width - text_width) / 2.0
        textobject = canvas.beginText(xposition, y)

        wraped_text = "\n".join(wrap(text, 80))  # 120 is line width
        textobject.textLines(wraped_text)
        canvas.drawText(textobject)
        lenstring = ceil((len(text) / 80))
        y = y - ((size * lenstring) * 2.5)

        # CONTEUDO (X EM RELACAO A Y)
        for file_rel in relation_files:
            name_of_document_dest = file_rel.get('name_file_dest')
            name_of_document_dest = name_of_document_dest.split('.', 1)[0]
            similar_set_result = file_rel.get('similar_set_source_dest')
            percent = file_rel.get('percent')

            canvas.setFont("Helvetica", 15)
            textobject = canvas.beginText(40, y)
            text = 'Documento ' + name_of_document_source + " em relação ao Documento " + name_of_document_dest + ": "
            wraped_text = "\n".join(wrap(text, 80))
            textobject.textLines(wraped_text)
            canvas.drawText(textobject)
            lenstring = ceil((len(text) / 80))
            y = y - ((size * lenstring) * 1.5)

            canvas.setFont("Helvetica", 13)
            canvas.drawString(40, y,
                              'Similaridade ' + str(percent) + "%")

            # SENTENCAS
            count = 0
            for sentences in similar_set_result:
                sentencedoc1 = name_of_document_source + ': ' + sentences.get('sentence_doc1')
                sentencedoc2 = name_of_document_dest + ': ' + sentences.get('sentence_doc2')
                lenstring = ceil((len(sentencedoc1) / 120))
                size = 12

                # Calcula se vai caber toda a sentenca na pagina, caso nao caiba, nova pagina
                calc_axisy = y - ((size * 2.5) + (size * 1.5) + ((size * lenstring) * 1.5))
                if (calc_axisy <= 30):
                    canvas.showPage()
                    y = 770

                canvas.setFont("Helvetica", size)
                y = y - (size * 2.5)
                canvas.drawString(60, y, "Sentença " + str(count) + ':')

                size = 8
                canvas.setFont("Helvetica", size)
                y = y - (size * 1.5)

                textobject = canvas.beginText(80, y)
                wraped_text = "\n".join(wrap(sentencedoc1, 120))  # 120 is line width
                textobject.textLines(wraped_text)
                canvas.drawText(textobject)
                y = y - ((size * lenstring) * 1.5)

                textobject = canvas.beginText(80, y)
                wraped_text = "\n".join(wrap(sentencedoc2, 120))  # 120 is line width
                textobject.textLines(wraped_text)
                canvas.drawText(textobject)
                y = y - ((size * lenstring) * 1.5)
                count += 1

            # troca pagina
            canvas.showPage()
            y = 750
            size = 16

        # salva documento
        canvas.save()


def temppdf_create(folder_temp_pdf):
    isExist = os.path.exists(folder_temp_pdf)
    if not isExist:
        os.makedirs(folder_temp_pdf)


def relatoriozip_delete(id_temp):
    path_relatorio = "api/analyses/analyse_result_report/relatorio" + id_temp + ".zip"
    isExist = os.path.exists(path_relatorio)
    if isExist:
        os.remove(path_relatorio)


def temppdf_delete(id_temp):
    path_temppdf = 'api/analyses/analyse_result_report/temppdf' + id_temp + "/"
    isExist = os.path.exists(path_temppdf)
    if isExist:
        shutil.rmtree(path_temppdf, ignore_errors=True)


def generate_zip(id_temp):
    path_relatorio = "api/analyses/analyse_result_report/relatorio" + id_temp + ".zip"
    path_temppdf = 'api/analyses/analyse_result_report/temppdf' + id_temp + '/'
    zipObj = ZipFile(path_relatorio, 'w')

    filenames = next(walk(path_temppdf), (None, None, []))[2]
    for filename in filenames:
        zipObj.write(path_temppdf + filename, filename)

    zipObj.close()
