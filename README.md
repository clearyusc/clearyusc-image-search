# URL Shortener Microservice



<blockquote>
  <p>User stories:</p>
    <ul>
      <li>I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.</li>     
      <li>When I visit that shortened URL, it will redirect me to my original link.</li>
    </ul>
</blockquote>
<h3>Example creation usage:</h3><code>https://little-url.herokuapp.com/new/https://www.google.com</code><br/><code>https://little-url.herokuapp.com/new/http://foo.com:80</code><h3>Example creation output</h3><code>{
  "original_url":"http://foo.com:80",
  "short_url":"https://little-url.herokuapp.com/8170"
}</code><h3>Usage:</h3><code>https://little-url.herokuapp.com/2871</code><h3>Will redirect to:</h3><code>https://www.google.com/</code></div></body>