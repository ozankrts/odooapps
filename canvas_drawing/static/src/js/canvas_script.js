
odoo.define('canvas_drawing.OdooServices', function (require) {
    "use strict";
    
    const { registry } = require("@web/core/registry");
    const { Layout } = require("@web/views/layout");
    const { useService } = require("@web/core/utils/hooks");
    const { Component, useState } = owl
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');
    let restore_array =[];
    let index = -1;
    let draw_color = "black";
    let draw_width = 2;
  
    class OdooCanvasDrawing extends Component { 
        setup(){
            this.actionService = useService("action");
            this.display = {
                controlPanel: {"top-right": false, "bottom-right": false}
            }
            this.state = useState({
                data_ids: [],
                start_background_color:"white"
            })
            this.orm = useService("orm")

        }
        
        async save(){
            var data_ids = await this.orm.searchRead('drawing', [["id", "=",this.actionService.currentController.action.context.active_id] ]);
            sessionStorage.setItem("drawName", data_ids[0].name);
            sessionStorage.setItem("drawId", data_ids[0].id);
            var drawId = sessionStorage.getItem('drawId');
            var drawName = sessionStorage.getItem('drawName');
            var self = this;
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d"); 
            ctx.fillStyle = "#f6f7fa";
            var base64 = canvas.toDataURL("image/jpeg");
            var base64Replace = base64.replace(/^data:image\/jpeg;base64,/, "");
            rpc.query({
                model: 'drawing',
                method: 'create_drawing',
                args: [[drawId],drawId,drawName, base64Replace],
            }).then(function (result) {
                if (result) {
                    let domain = [['id', '=', result]]
                    ctx.clearRect(0,0, canvas.width, canvas.height);
                    self.actionService.doAction({
                        type: "ir.actions.act_window",
                        name: "Drawing",
                        res_model: "drawing",
                        res_id: parseInt(result),
                        domain,
                        views: [
                            [false, "form"],
                        ]
                    })
                }
            });
            
        }
        undo_last(){
            const canvas = document.getElementById("canvas");
            let context = canvas.getContext("2d");
            if (index <= 0){
                this.clear_canvas();
            }else{
                index -= 1;
                restore_array.pop();
                context.putImageData(restore_array[index], 0, 0);
            }
        }

        change_color(element) {
            draw_color = document.getElementById("colorPicker").value;
            console.log(draw_color);
        }
        change_size(element) {
            draw_width = document.getElementById("sizePicker").value;
            console.log(draw_width);
        }
        clear_canvas(){
            const canvas = document.getElementById("canvas");
            let context = canvas.getContext("2d");
            context.fillStyle = this.state.start_background_color;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillRect(0, 0, canvas.width, canvas.height);
            restore_array = [];
            index = -1;
        }
       
        run(){
            document.getElementById("runbttn").hidden =true;
            const canvas = document.getElementById("canvas");
            canvas.width= window.innerWidth;
            canvas.height= window.innerHeight - (window.innerHeight*30/100);
            let context = canvas.getContext("2d");
            var is_drawing = false;
            var rect = canvas.getBoundingClientRect();
            context.fillStyle = this.state.start_background_color;
            context.fillRect(0, 0, canvas.width, canvas.height);
            canvas.addEventListener("touchstart", touchstart, false);
            canvas.addEventListener("touchmove", touchdraw, false);
            canvas.addEventListener("mousedown", start, false);
            canvas.addEventListener("mousemove", draw, false);
            canvas.addEventListener("touchend", stop, false);
            canvas.addEventListener("mouseup", stop, false);
            canvas.addEventListener("mouseout", stop, false);

            function start(event) {
                is_drawing = true;
                context.beginPath();
                context.moveTo(event.offsetX, event.offsetY);
                event.preventDefault();
            }

            function touchstart(event) {
                is_drawing = true;
                context.beginPath();
                context.moveTo(event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top);
                event.preventDefault();
            }

            function draw(event) {
                if(is_drawing){
                    context.lineTo(event.offsetX, event.offsetY);
                    context.strokeStyle = draw_color;
                    context.lineWidth = draw_width;
                    context.lineCap = "round";
                    context.lineJoin="round";
                    context.stroke();
                }
                event.preventDefault();
            }

            function touchdraw(event) {
                if(is_drawing){
                    context.lineTo(event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top);
                    context.strokeStyle = draw_color;
                    context.lineWidth = draw_width;
                    context.lineCap = "round";
                    context.lineJoin="round";
                    context.stroke();
                }
                event.preventDefault();
            }

            function stop(event) {
                if(is_drawing){
                    context.stroke();
                    context.closePath();
                    is_drawing = false;
                }
                event.preventDefault();
                if (event.type != 'mouseout') {
                    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
                    index += 1;
                }
            }

        }
        
    }
    
    OdooCanvasDrawing.template = 'owl.OdooServices';
    OdooCanvasDrawing.components = { Layout }


    registry.category("actions").add('owl.OdooServices', OdooCanvasDrawing);
    return OdooCanvasDrawing;
});



