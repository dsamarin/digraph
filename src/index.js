import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'

const editor = document.getElementById('editor');
const result = document.getElementById('result');

function copy() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const div = document.createElement('div');

    div.className = 'hidden';
    div.contentEditable = true;

    const data = document.getElementById('svg-canvas').outerHTML;

    img.className = "hidden";
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            const newimg = new Image();
            const url = URL.createObjectURL(blob);
            newimg
        })
        // Select this image
        const doc = document;
        if (doc.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(img);
            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = doc.createRange();
            range.selectNodeContents(img);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        // Copy
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        div.parentNode.removeChild(div);
    }
    img.src = 'data:image/svg+xml,' + encodeURIComponent(data);

    div.appendChild(img);
    document.body.appendChild(div);
}

document.getElementById('copy').addEventListener('click', copy);

function parse(string) {
    // Body = Pair*
    const pairs = [];

    const lines = string.split(/\s*\n\s*/g);
    for (const line of lines) {
        if (line) {
            const coords = line.split(/[,\s]+(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
            pairs.push(coords);
        }
    }

    return pairs;
}

function refresh() {
    const body = parse(editor.value);

    const g = new dagreD3.graphlib.Graph({
        directed: true
    }).setGraph({})
    .setDefaultEdgeLabel(() => ({}));
    
    const obj = {};
    for (const p of body) {
        const x = p[0];
        const y = p[1];

        if (!obj[x]) {
            const xobj = {id: x};
            g.setNode(x, xobj);
            obj[x] = true;
        }

        if (y) {
            if (!obj[y]) {
                const yobj = {id: y};
                g.setNode(y, yobj);
                obj[y] = true;
            }
            g.setEdge(x, y, {
                curve: d3.curveBasis,
                arrowhead: 'vee'
            });
        }
    }

    var render = new dagreD3.render();

    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg");

    // Set svg width and height
    svg.attr('width', result.offsetWidth)
    svg.attr('height', result.offsetHeight)

    svg.selectAll("*").remove();
    const svgGroup = svg.append("g");
    
    // Run the renderer. This is what draws the final graph.
    render(svgGroup, g);
    
    // Center the graph
    var xCenterOffset = (parseInt(svg.attr("width"), 10) - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
};

editor.value = "Reduce Reuse\nReuse Recycle\nRecycle Reduce";
refresh();

editor.addEventListener('keyup', refresh);
