/**
 * The Shire — welcome page. Sits on the dark Hobbit-doorway page background
 * with slow gloomy clouds drifting across, and Bilbo's invitation card.
 *
 * @param {{ onBegin: () => void }} props
 */
export default function Shire({ onBegin }) {
  return (
    <section className="shire">
      <div className="gloomy-clouds" aria-hidden="true">
        <span className="g-cloud g-cloud-1" />
        <span className="g-cloud g-cloud-2" />
        <span className="g-cloud g-cloud-3" />
        <span className="g-cloud g-cloud-4" />
        <span className="g-cloud g-cloud-5" />
        <span className="g-cloud g-cloud-6" />
      </div>

      <div className="shire-card">
        <h2>Welcome to the Shire</h2>
        <p>
          The kettle is whistling, the pipe-weed is fresh, and a strange errand is afoot.
          Bilbo has left a parcel and a question or two — well, perhaps eight — for any
          traveler bold enough to carry a small, golden burden eastward.
        </p>
        <p className="quietly">
          <em>&ldquo;It&rsquo;s a dangerous business, going out your door.&rdquo;</em>
          {' '}— B. Baggins
        </p>
        <button className="btn-stone" onClick={onBegin}>
          Begin the Journey →
        </button>
      </div>
    </section>
  );
}
