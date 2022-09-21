import spacy
from pdfminer import high_level
import docx2txt

import re
import os

nlp = spacy.load("pt_core_news_sm")
all_stop_words = nlp.Defaults.stop_words


class TextManipulation:
    def segmentation_based_sentences(self, text):
        originaltext_segmented = []

        doc = re.findall(r'[^.!?]+[.!?]?', text)

        for sentence in doc:
            sentence_source = self.remove_only_spaces(sentence)
            sentence_clean = self.remove_stop_words_puncts_spaces(sentence)

            if len(sentence_clean) > 0 and not self.verify_sentence_already_segmented(originaltext_segmented,
                                                                                      sentence_clean):
                originaltext_segmented.append((sentence_source, sentence_clean))

        return originaltext_segmented

    def segmentation_based_kgram(self, text):
        originaltext_segmented = []
        kgram = 3

        counter_tokens = 0
        doc = nlp(text)
        temp_original = []
        temp_segmented = []
        position = 0
        position_next_start = 0
        text_tokenized = []

        for token in doc:
            text_tokenized.append(token)

        while position != len(text_tokenized):
            token = text_tokenized[position]
            position += 1

            if token.tag_ != "PUNCT" and token.tag_ != "SPACE":
                temp_original.append(token)

            if token.text not in all_stop_words and token.lemma_ not in all_stop_words \
                    and token.tag_ != "PUNCT" and token.tag_ != "SPACE":
                counter_tokens += 1
                temp_segmented.append(token)
                if counter_tokens == 1:
                    position_next_start = position

            if counter_tokens == kgram:
                originaltext_segmented.append((temp_original.copy(), temp_segmented.copy()))
                temp_original.clear()
                temp_segmented.clear()
                counter_tokens = 0
                position = position_next_start

        return originaltext_segmented

    def verify_sentence_already_segmented(self, list_sentences, sentence):
        if len(list_sentences) == 0:
            return False

        for sentence_in_list in list_sentences:
            sentence_list_str = sentence_in_list[1]
            sentence_str = sentence

            if sentence_list_str == sentence_str:
                return True

        return False

    def remove_stop_words_puncts_spaces(self, sentence):
        sentence_result = []
        new_string = re.sub(r'[^\w\s]', '', sentence)
        for token in new_string.split(" "):
            if token != " " and token not in [","] and token not in all_stop_words:
                sentence_result.append(token)
        return sentence_result

    def remove_only_spaces(self, sentence):
        return sentence.split(" ")


class FileData:
    name_file = None
    text = None


def get_info_from_files(dir_analyse_files):

    files = os.listdir(dir_analyse_files)

    files_data_store = []

    for file_name in files:
        file_data = FileData()
        name_file = file_name
        path_file = dir_analyse_files + '/' + name_file

        text = extract_text(path_file)

        text = text.lower()
        file_data.name_file = name_file
        file_data.text = text
        files_data_store.append(file_data)

    return files_data_store


# Extrai texto de .txt,.pdf,.docx
def extract_text(path_file):
    extracted_text = ""

    if path_file.endswith('.pdf'):

        with open(path_file, 'rb') as file:
            extracted_text = high_level.extract_text(file.name, "")


    elif path_file.endswith('.txt'):
        with open(path_file, 'rb') as file:
            for line in file:
                extracted_text += line.decode() + ' '


    elif path_file.endswith('.docx'):
        with open(path_file, 'rb') as file:
            extracted_text = docx2txt.process(file.name, "")

    extracted_text = " ".join(extracted_text.split())
    return extracted_text
