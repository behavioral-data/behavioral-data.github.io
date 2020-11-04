import yaml

<<<<<<< HEAD

def input_options(prompt, options):
    print(prompt)
    print("Valid Options:")
    for o in options:
        print(f"    {o}")
    selected_option = input()
    while selected_option not in options:
        print("Invalid option, please try again.")
        selected_option = input(":")
    return selected_option


=======
>>>>>>> 5f7ea909ece63556f404588fb2803597781ac010
def load_jeykll_config(path="_config.yml"):
    with open(path) as stream:
        try:
            return (yaml.safe_load(stream))
        except yaml.YAMLError as exc:
            print(exc)

<<<<<<< HEAD

=======
>>>>>>> 5f7ea909ece63556f404588fb2803597781ac010
def dump_dict_to_yaml(data, out_dest):
    out_file = open(out_dest, "w")
    out_file.write("---\n")
    yaml.dump(data, out_file, allow_unicode=True)
    out_file.write("---")

<<<<<<< HEAD

def y_or_n(prompt):
    response = input(prompt + "[y/n]:")
    while response not in ["y", "n"]:
=======
def y_or_n(prompt):
    response = input(prompt + "[y/n]:")
    while not response in ["y","n"]:
>>>>>>> 5f7ea909ece63556f404588fb2803597781ac010
        print("Invalid response")
        response = input(prompt + "[y/n]:")
    return response == "y"