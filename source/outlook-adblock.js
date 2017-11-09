run();

// Gets the node housing the advertisement by class name
function getAdvertisementNode(clsName)
{
	var list = document.getElementsByClassName(clsName);

	// Assume the element must not be rendered yet
	if(list.length == 0)
		return null;

	// Something must've changed the format, we only 
	// expected a single element with the name
	if(list.length > 1)
		throw "Multiple elements matched advertisement node name";
	
	return list[0];
}

// Determines if the node is a DIV
function isDiv(node)
{
	return node.tagName.toLowerCase() == "div";
}

// Get the number of attributes that a node has
function getNumberOfAttributes(node)
{
	var count = 0;
	for( var i = 0; i < node.attributes.length; i++) {
		if(node.attributes[i].specified)
			count++;
	}
	return count;
}

function removeAdvertisementRoot(node) 
{
	if(!isDiv(node))
		throw "Root of advetisement is not a div";

	var numberOfAttributes = getNumberOfAttributes(node);
	if(numberOfAttributes != 1)
		throw "Root of advertisement does not have a single attribute, count=".concat(numberOfAttributes);
	
	if(!node.hasAttribute("style"))
		throw "Root of advertisement is missing 'style' attribute";

	if(!node.attributes[0].value.includes("height"))
		throw "Root of advertisement is missing `height` attribute";

	node.parentNode.removeChild(node);
}

function run() 
{
	try {
		
		const PAGE_LOAD_POLL_TIME = 5000;
		const PSUEDO_EMAIL_AD_STRING = "__Microsoft_Owa_MessageListAds_ListView_templates_cs_x";

		var adNode = getAdvertisementNode(PSUEDO_EMAIL_AD_STRING);

		// If we couldnt find it, queue up the timer so we can
		// try again to find it later 
		if ( null == adNode ) {
			setTimeout(run, PAGE_LOAD_POLL_TIME);
			return;
		}

		// We expect to have 3 parents of empty divs
		var node = adNode;
		for (i = 0; i < 4; i++) {
			var node = node.parentNode;

			// Must be a dov
			if(!isDiv(node)) 
				throw "Non-div node found tracing parents, index=".concat(i);
			
			// We should only have a single child
			if( node.childElementCount != 1 ) 
				throw "Too many children found on parent div, index=".concat(i);
			
			// The last node should have a single attribute of "style"
			var numAttributesExpected = 0;
			if (i == 3) 
				numAttributesExpected = 1;

			if (getNumberOfAttributes(node) != numAttributesExpected) 
				throw "Unexpected num attributes on parent div, index=".concat(i);
		}

		// Check that this last node had an attribute of "Style"	
		if(!node.hasAttribute("style")) 
			throw "Missing node with attribute style in parent tree";

		// We should be 1 node before the 
		// Node is now the node we want to delete, before doing so
		// run some valications to make sure its the right one before deleting
		removeAdvertisementRoot(node.parentNode);

	} catch(e) {
		console.log(e)
		console.log("If you see this message, contact the dev(s).")
	}

	return;
}

