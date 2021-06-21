import ipywidgets as widgets
from IPython.display import clear_output,display

# Define multiple choice container
def multipleChoice(description, options, correct_answer):
    clear_output()
    
    if correct_answer not in options:
        options.append(correct_answer)
    
    correct_answer_index = options.index(correct_answer)
    
    radio_options = [(words, i) for i, words in enumerate(options)]
    alternativ = widgets.RadioButtons(
        options = radio_options,
        description = '',
        disabled = False
    )
    
    question_widget = widgets.Output()
    with question_widget:
        print(description)
        
    when_correct_widget = widgets.Output()

    def check_selection(b):
        a = int(alternativ.value)
        if a==correct_answer_index:
            s = '\x1b[6;30;42m' + "Correct. Well Done!" + '\x1b[0m' +"\n" #green color
        else:
            s = '\x1b[5;30;41m' + "Wrong. Try Again?" + '\x1b[0m' +"\n" #red color
        with when_correct_widget:
            clear_output()
            print(s)
        return
    
    check = widgets.Button(description="Check")
    check.on_click(check_selection)   
    return widgets.VBox([question_widget, alternativ, check, when_correct_widget])
# ------------------

# define select container 
def multipleSelection(question, selections, when_correct):
    clear_output()

    selection_widgets = []
    answer_widgets = []
    selection_h_boxes = []

    for selection in selections:
        options = [('Select...', '')] + selection.get('options')

        select_widget = widgets.Dropdown(
            options=options,
            value='',
            description = selection.get('name') + ':',
        )
        answer_widget = widgets.Output()
        selection_h_box = widgets.HBox([select_widget, answer_widget])

        selection_widgets.append(select_widget)
        answer_widgets.append(answer_widget)
        selection_h_boxes.append(selection_h_box)

    question_widget = widgets.Output()
    with question_widget:
        print(question)
        
    when_correct_widget = widgets.Output()

    def check_selection(b):
        correct = True
        for i, selection in enumerate(selections):

            if selection_widgets[i].value==selection.get('answer'):
                answer = '\x1b[6;30;42m' + "Correct. Well Done!" + '\x1b[0m' +"\n" #green color
            else:
                answer = '\x1b[5;30;41m' + "Wrong. Try Again?" + '\x1b[0m' +"\n" #red color
                correct = False
            with answer_widgets[i]:
                clear_output()
                print(answer)

        if(correct):
            with when_correct_widget:
                clear_output()
                print(when_correct)
        return
    
    check = widgets.Button(description="Check")
    check.on_click(check_selection)  
    v_box_widgets = []
    v_box_widgets.append(question_widget)
    v_box_widgets.extend(selection_h_boxes)
    tmp = [check, when_correct_widget]
    v_box_widgets.extend(tmp)

    return widgets.VBox(v_box_widgets)
# ------------------

def question1():
    question = 'Categorise all the elements in the driver data'
    options = [('Restricted', 'restricted'), ('Confidential', 'confidential'), ('Internal', 'internal'), ('Public', 'public')]
    when_correct = 'Congratulations! You have correctly categorized all of the data.  Move to the next step'
    selectors = []
    selectors.append({'name': 'id', 'options': options, 'answer': 'confidential'})
    selectors.append({'name': 'email', 'options': options, 'answer': 'confidential'})
    selectors.append({'name': 'password', 'options': options, 'answer': 'restricted'})
    selectors.append({'name': 'fullname', 'options': options, 'answer': 'confidential'})
    selectors.append({'name': 'gender', 'options': options, 'answer': 'confidential'})
    selectors.append({'name': 'ssn', 'options': options, 'answer': 'restricted'})
    selectors.append({'name': 'address', 'options': options, 'answer': 'restricted'})
    selectors.append({'name': 'dob', 'options': options, 'answer': 'confidential'})
    selectors.append({'name': 'bank', 'options': options, 'answer': 'restricted'})
    selectors.append({'name': 'licence', 'options': options, 'answer': 'confidential'})
    selectors.append({'name': 'licenceupload', 'options': options, 'answer': 'restricted'})
    selectors.append({'name': 'vehicle', 'options': options, 'answer': 'confidential'})

    Q1 = multipleSelection(question, selectors,when_correct)
    display(Q1)

clear_output()
