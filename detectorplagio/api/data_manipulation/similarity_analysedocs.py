import os

import api.data_manipulation.textdata as text_data
import api.data_manipulation.similarity_functions as similarity_data


class AnalyseResult:
    name_file1 = None
    name_file2 = None
    similar_sets_log1 = None
    similar_sets_log2 = None
    percent_plagiarism = None


def calculate_similarity_function(files_data_store, dir_id_analyse, type_analyse):
    # Analyse Files:
    result_analyse = []
    for file1 in files_data_store:
        for file2 in files_data_store:
            if file1.name_file != file2.name_file:
                # Otimização
                # Verifica se os documentos ainda não foram analisados pois (doc1,doc2) == (doc2,doc1)
                files_already_analysed = files_already_analyzed(result_analyse, file1.name_file, file2.name_file)
                # Caso não tiverem analisa, e caso já, apenas busca o resultado
                if files_already_analysed is None:
                    result = analyse_docs(file1.name_file, file2.name_file, file1.text, file2.text, type_analyse)
                    result_analyse.append(result)

                else:
                    result_analyse.append(files_already_analysed)

        # Att o status do processo dos arquivos:
        if os.path.exists(dir_id_analyse + "/processing-lock.txt"):
            with open(dir_id_analyse + "/processing-lock.txt", "r+") as f:
                data = f.read()
                data = int(data) + 1
                f.seek(0)
                f.write(str(data))
                f.close()

    # Generate Result Object Json
    data_analyse_objects = []
    source_name_files = []
    for result in result_analyse:
        if result.name_file1 not in source_name_files:
            source_name_files.append(result.name_file1)

        resultobject = {"name_file1": result.name_file1, "name_file2": result.name_file2,
                        "similar_sets_log1": result.similar_sets_log1,
                        "similar_sets_log2": result.similar_sets_log2,
                        "percent_plagiarism": result.percent_plagiarism}
        data_analyse_objects.append(resultobject)

    # Generate Result Graph
    data_final_analyse = []
    # Ordenation
    for name in source_name_files:
        data_source_file = [x for x in data_analyse_objects if x.get('name_file1') == name]
        relation_files = []
        name_source = ""
        for data_file in data_source_file:
            name_source = data_file.get('name_file1')
            relation_files.append(
                {
                    "name_file_dest": data_file.get('name_file2'),
                    "similar_set_source_dest": data_file.get('similar_sets_log1'),
                    "similar_set_dest_source": data_file.get('similar_sets_log2'),
                    "percent": data_file.get('percent_plagiarism')
                })

        data_final_analyse.append({
            "name_file_source": name_source,
            "relation_files": relation_files
        })

    return data_final_analyse


def files_already_analyzed(list_files, file1, file2):
    if len(list_files) <= 0:
        return None

    for item in list_files:
        item_name_file1 = item.__getattribute__('name_file1')
        item_name_file2 = item.__getattribute__('name_file2')
        percent_plagiarism = item.__getattribute__('percent_plagiarism')
        similar_sets_log1 = item.__getattribute__('similar_sets_log1')
        similar_sets_log2 = item.__getattribute__('similar_sets_log2')
        # Se essa combinação de Doc já foi analisada, retorna apenas atualziando os valores
        if item_name_file2 == file1 and item_name_file1 == file2:
            analyse = AnalyseResult()
            analyse.name_file1 = item_name_file2
            analyse.name_file2 = item_name_file1
            analyse.similar_sets_log1 = similar_sets_log2
            analyse.similar_sets_log2 = similar_sets_log1
            analyse.percent_plagiarism = percent_plagiarism
            return analyse

    return None


def analyse_docs(file_name1, file_name2, doc1, doc2, type_analyse):
    text_manipulation = text_data.TextManipulation()
    similarity = similarity_data.Similarity()

    # # FEM
    doc1_segmented = text_manipulation.segmentation_based_sentences(doc1)
    doc2_segmented = text_manipulation.segmentation_based_sentences(doc2)

    # doc1_segmented = text_manipulation.segmentation_based_kgram(doc1)
    # doc2_segmented = text_manipulation.segmentation_based_kgram(doc2)

    # #  SIMILARITY 1: (doc1 em relação ao doc2)
    qntd_similar_sets1, similar_sets_log1, sentences_analysed1 = similarity.calculate_similar_sentences_in_docs(
        doc1_segmented, doc2_segmented, [], type_analyse)
    degree_resemblance1 = similarity.degree_resemblance(qntd_similar_sets1, len(doc1_segmented))

    #  SIMILARITY 2: (doc2 em relação ao doc1)
    qntd_similar_sets2, similar_sets_log2, sentences_analysed2 = similarity.calculate_similar_sentences_in_docs(
        doc2_segmented, doc1_segmented, sentences_analysed1, type_analyse)
    degree_resemblance2 = similarity.degree_resemblance(qntd_similar_sets2, len(doc2_segmented))

    percent_plagiarism = similarity.odds_ratio_in_percent(degree_resemblance1, degree_resemblance2)

    analyse = AnalyseResult()
    analyse.name_file1 = file_name1
    analyse.name_file2 = file_name2
    analyse.similar_sets_log1 = similar_sets_log1
    analyse.similar_sets_log2 = similar_sets_log2
    analyse.percent_plagiarism = percent_plagiarism

    return analyse
