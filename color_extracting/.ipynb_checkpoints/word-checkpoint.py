from color import *

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('word',help="enter_word")
    parser.add_argument('--thief',help="enter_word",default='')
    args = parser.parse_args()
    word = args.word
    if args.thief:
        print('thief')
        print(word_to_color_thief(word))
    else:
        print(word_to_color(word))
    
if __name__ == "__main__":
    main()