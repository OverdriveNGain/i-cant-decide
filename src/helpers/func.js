const GenerateArray = (length, generator) => {

    const temp = [];
    for (let i = 0; i < length; i++) {
        temp.push(generator(i));
    }
    return temp;
}

const GenerateArrayFromObject = (object, generator) => {
    const temp = [];
    for (let property in object) {
        temp.push(generator(property));
    }
    return temp;
}

const Tern = (bool, v1, v2) => {
    if (bool)
        return v1;
    return v2;
}

const Pd = (e, func) => { e.preventDefault(); func(); }

export { GenerateArray, GenerateArrayFromObject, Tern, Pd };