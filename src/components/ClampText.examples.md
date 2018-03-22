ClampText examples

```js
const containerStyle = {
	backgroundColor: 'white',
	borderRadius: 4,
	maxWidth: 250,
	padding: 16,
	paddingTop: 0,
	margin: 16,
	outline: '1px solid rgba(255, 180, 220, 0.75)',
	outlineOffset: 4,
};

const longText = 'The unicorn is a legendary creature that has been described since antiquity as a beast with a single large, pointed, spiraling horn projecting from its forehead. The unicorn was depicted in ancient seals of the Indus Valley Civilization and was mentioned by the ancient Greeks in accounts of natural history by various writers, including Ctesias, Strabo, Pliny the Younger, and Aelian. The Bible also describes an animal, the re\'em, which some versions translate as unicorn. In European folklore, the unicorn is often depicted as a white horse-like or goat-like animal with a long horn and cloven hooves (sometimes a goat\'s beard). In the Middle Ages and Renaissance, it was commonly described as an extremely wild woodland creature, a symbol of purity and grace, which could only be captured by a virgin. In the encyclopedias its horn was said to have the power to render poisoned water potable and to heal sickness. In medieval and Renaissance times, the tusk of the narwhal was sometimes sold as unicorn horn. The unicorn, through its intemperance and not knowing how to control itself, for the love it bears to fair maidens forgets its ferocity and wildness; and laying aside all fear it will go up to a seated damsel and go to sleep in her lap, and thus the hunters take it. The qilin (Chinese: 麒麟), a creature in Chinese mythology, is sometimes called "the Chinese unicorn", and some ancient accounts describe a single horn as its defining feature. However, it is more accurately described as a hybrid animal that looks less unicorn than chimera, with the body of a deer, the head of a lion, green scales and a long forwardly-curved horn. The Japanese version (kirin) more closely resembles the Western unicorn, even though it is based on the Chinese qilin. The Quẻ Ly of Vietnamese myth, similarly sometimes mistranslated "unicorn" is a symbol of wealth and prosperity that made its first appearance during the Duong Dynasty, about 600 CE, to Emperor Duong Cao To, after a military victory which resulted in his conquest of Tây Nguyên. In November 2012 the History Institute of the DPRK Academy of Social Sciences, as well as the Korea News Service, reported that the Kiringul had been found, which is associated with a kirin ridden by King Dongmyeong of Goguryeo.';

const shortText = 'Hunts for an actual animal as the basis of the unicorn myth have added a further layer of mythologizing about the unicorn.';

<div
	style={{
		backgroundColor: '#fafbfe',
		display: 'flex',
		padding: 16,
	}}>

	<div style={containerStyle}>
		<h3>Collapsable example</h3>
		<ClampText collapsable lines={5}>{longText}</ClampText>
	</div>

	<div style={containerStyle}>
		<h3>Custom button example</h3>
		<ClampText expandLabel={<button>{'▼'}</button>} lines={5}>{longText}</ClampText>
	</div>

	<div style={containerStyle}>
		<h3>No clamping needed</h3>
		<ClampText collapsable lines={5}>{shortText}</ClampText>
	</div>

</div>

```
