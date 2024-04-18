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

        fetch(storyDataUrl).then(response => response.json()).then(json => {
            this.storyData = json;
            this.sceneMap = {
                "Start": Start,
                "Location": Location,
                "SecretChamber": SecretChamber,
                "Speakeasy": Speakeasy,
                "KansasCity": KansasCity,
                "End": End
            };
            this.gotoScene(this.firstSceneClass, this.storyData.InitialLocation);
        });


        console.log('lolz');
    }

    gotoScene(sceneClass, dataKey) {
        if (typeof sceneClass === 'string') {
            sceneClass = this.sceneMap[sceneClass] || Location;
        }
        const data = this.storyData.Locations[dataKey];
        this.scene = new sceneClass(this);
        this.scene.create(dataKey, data);
    }

    addChoice(text, choiceData) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = text;
        button.onclick = () => {
            while (this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild);
            }
            this.scene.handleChoice(choiceData);
        };
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
        
    }

    create(dataKey, data) {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.show(data.Body);

        if (data.Choices) {
            for (let choice of data.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.", null);
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("> " + choice.Text);
            this.engine.gotoScene(choice.SceneType || "Location", choice.Target);
        } else {
            this.engine.gotoScene("End");
        }
    }
}
