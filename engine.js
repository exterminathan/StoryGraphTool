class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                Object.keys(this.storyData.Items).forEach(itemKey => {
                    this.storyData.Items[itemKey].pickedUp = false;
                });
                this.gotoScene(firstSceneClass)
            }
        );
    }


    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
            this.scrollToBottom();
        }
    }

    removeChoice(choiceText) {
        const buttons = this.actionsContainer.childNodes;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].innerText === choiceText) {
                this.actionsContainer.removeChild(buttons[i]);
                break;
            }
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
        this.scrollToBottom();
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}



class GameItem {
    constructor(itemName, use, pickedUp, introMsg, initLocation) {
        this.itemName = itemName; 
        this.use = use;
        this.pickedUp = pickedUp;
        this.intm = introMsg;
        this.initLocation = initLocation;
    }

    describe() {
        return ('You found [' + this.itemName + ']');
    }

}