window.JST = {};
window.JST['comment'] = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'style':('float: left; margin-right: 12px'), "class": ('commentAuthorImage') }));
buf.push('>');
 if(user)
{
buf.push('<img');
buf.push(attrs({ 'src':("http://graph.facebook.com/" + (user.facebookId) + "/picture"), 'style':('border: solid 1px #ccc') }));
buf.push('/>');
}
buf.push('</div><div');
buf.push(attrs({ 'style':('font-weight: bold'), "class": ('commentAuthor') }));
buf.push('>');
 if(user)
{
var __val__ = user.name
buf.push(escape(null == __val__ ? "" : __val__));
}
buf.push('</div><div');
buf.push(attrs({ "class": ('commentDate') }));
buf.push('>');
var __val__ = dateCreated
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div');
buf.push(attrs({ "class": ('commentBody') }));
buf.push('>');
var __val__ = body
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div>');
}
return buf.join("");
};
window.JST['video'] = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('video') }));
buf.push('><div');
buf.push(attrs({ 'style':('float: left'), "class": ('title') }));
buf.push('>');
var __val__ = title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><div');
buf.push(attrs({ 'style':('float: right'), "class": ('votes') }));
buf.push('>');
var __val__ = votes.length
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><iframe');
buf.push(attrs({ 'width: 300':(true), 'height':(200), 'src':('http://www.youtube.com/embed/' + ( videoId ) + ''), 'frameborder':(0), 'allowfullscreen':(true) }));
buf.push('></iframe><input');
buf.push(attrs({ 'id':('btnAddComment'), 'type':('button'), 'value':('Add Comment') }));
buf.push('/><input');
buf.push(attrs({ 'id':('btnAddVote'), 'type':('button'), 'value':('Vote') }));
buf.push('/><div');
buf.push(attrs({ "class": ('comments') }));
buf.push('></div></div>');
}
return buf.join("");
};
