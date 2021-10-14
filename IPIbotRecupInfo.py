file = open("properties.txt", "r")
listTextFile = file.read().split('\n')
file.close()


def RecupToken():
    token = listTextFile[0].split('=')[1]
    return token


def RecupName():
    name = listTextFile[1].split('=')[1]
    return name


def RecupPathLicence(forma):
    if forma == 'pdf':
        path = listTextFile[2].split('=')[1]
    elif forma == 'img':
        path = listTextFile[3].split('=')[1]
    return path


def RecupPathMaster(forma, anne):
    if anne == 1:
        if forma == 'pdf':
            path = listTextFile[4].split('=')[1]
        elif forma == 'img':
            path = listTextFile[5].split('=')[1]
    elif anne == 2:
        if forma == 'pdf':
            path = listTextFile[6].split('=')[1]
        elif forma == 'img':
            path = listTextFile[7].split('=')[1]
    return path
