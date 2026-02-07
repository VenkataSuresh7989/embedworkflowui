<template>
	<div class="container mt-3">
		<!-- CMS UI -->		
    <div class="cardWrap">
      <h6 class="cardHeading ">
        <font-awesome-icon :icon="['fas', 'arrows-to-dot']" />CMS UI</h6>
      <ul class="steps">
        <li> <b>store.js :</b>
          <ol>
            <li>Uncomment baseIp and axios (e.g., line no: 10 & 11).</li>
            <li>Comment the remaining baseIp configurations in the store.</li>
          </ol>
        </li>
        <li><b>package.json :</b> – Update version number</li>
        <li> <b>Build Process (Terminal) :</b>
          <ol>
            <li>Press Ctrl + C → When prompted "Terminate batch job (y/n)", press Y.</li>
            <li>Run the command: npm run build.</li>
            <li>The updated build will be generated automatically in the dist folder.</li>
            <li>Navigate to dist → index.html.</li>
            <li>The file will appear as a single line of code.</li>
            <li>Go to Code (menu bar) → Reformat Code or press Ctrl + Alt + L.</li>
          </ol>
        </li>
        <li> <b>Static Folder Update :</b>
          <ol>
            <li>Go to the corresponding dist folder.</li>
            <li>Copy the following files/folders: css, fonts, img, js, favicon, index.html</li>
            <li>Remove existing files from the static folder.</li>
            <li>Paste the copied dist files into the static folder.</li>
            <li>Example path: D:\Workstation\CMS Build Files\Opti-Trace Server Ver 23.03.03a\static</li>
            <li>If any xml binding files are changed, copy them to the static folder as well.</li>
            <li>If there are no XML changes, copying XML files is not required.</li>
          </ol>
        </li>
      </ul>
    </div>		
		<!-- CMS API -->		
			<div class="cardWrap">
				<h6 class="cardHeading mb-3">
          <font-awesome-icon :icon="['fas', 'server']" />CMS API</h6>
				<ul class="steps">
					<li> <b>Version Update :</b>
						<ol>
							<li>Change the version number in OptiSrvST.py.</li>
						</ol>
					</li>
					<li> <b>Build Executable :</b>
						<ol>
							<li>Open Command Prompt and navigate to: D:\Latest_GIT\Amplifier_API</li>
							<li>Run the following command: pyinstaller --icon=favicon.ico --noconsole --onefile OptiSrvST.py</li>
							<li>This will create the OptiSrvST file inside the dist folder.</li>
						</ol>
					</li>
					<li> <b>Deploy Build :</b>
						<ol>
							<li>Copy the generated OptiSrvST file from the dist folder.</li>
							<li>Paste it into the corresponding server folder.</li>
							<li>Example path: D:\Workstation\CMS Build Files\Opti-Trace Server Ver 23.03.03a</li>
						</ol>
					</li>
				</ul>
			</div>
		
		<!-- ANDROID -->		
			<div class="cardWrap">
				<h6 class="cardHeading mb-3">
          <font-awesome-icon :icon="['fab', 'android']" />ANDROID
        </h6>
        <ul class="steps">
          <li> 
            <ol>
              <li>ionic cap copy android (or) ionic capacitor sync android</li>
              <li>ionic cap open android</li>
            </ol>
          </li>
        </ul>				
			</div>		
		<!-- IOS -->		
    <div class="cardWrap">
      <h6 class="cardHeading mb-3">
        <font-awesome-icon :icon="['fab', 'apple']" />IOS</h6>
        <ul class="steps">
          <li> 
            <ol>
              <li>sudo ionic capacitor copy ios</li>
              <li>sudo ionic capacitor open ios</li>
            </ol>
          </li>
        </ul>
    </div>
		<!-- TEST FLIGHT -->
    <div class="cardWrap">
      <h6 class="cardHeading mb-3">
        <font-awesome-icon :icon="['fas', 'plane']" />TEST FLIGHT SETUP</h6>
        <ul class="steps">
          <li> 
            <ol>
              <li>Go to Products → Archive</li>
              <li>Distribute App</li>
              <li>TestFlight (Internal Only)</li>
              <li>Distribute</li>
              <li>Done</li>
            </ol>
          </li>
        </ul>
    </div>		
	</div>
</template>
<script>
export default {
  name: "BuildFlow",
};
</script>
