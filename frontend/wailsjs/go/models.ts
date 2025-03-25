export namespace main {
	
	export class Character {
	    collectionNo: number;
	    name: string;
	    className: string;
	    face: string;
	
	    static createFrom(source: any = {}) {
	        return new Character(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.collectionNo = source["collectionNo"];
	        this.name = source["name"];
	        this.className = source["className"];
	        this.face = source["face"];
	    }
	}
	export class ServantDetail {
	    name: string;
	    originalName: string;
	    className: string;
	    rarity: number;
	    // Go type: struct { CV string "json:\"cv\""; Illustrator string "json:\"illustrator\"" }
	    profile: any;
	    // Go type: struct { CharaGraph struct { Ascension map[string]string "json:\"ascension\""; Costume map[string]string "json:\"costume\"" } "json:\"charaGraph\"" }
	    extraAssets: any;
	
	    static createFrom(source: any = {}) {
	        return new ServantDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.originalName = source["originalName"];
	        this.className = source["className"];
	        this.rarity = source["rarity"];
	        this.profile = this.convertValues(source["profile"], Object);
	        this.extraAssets = this.convertValues(source["extraAssets"], Object);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

