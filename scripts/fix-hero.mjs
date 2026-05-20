import { readFileSync, writeFileSync } from "fs";

const p = new URL("../components/marketing/hero.tsx", import.meta.url);
let c = readFileSync(p, "utf8");

c = c.replace(
  `              </span>
            </div>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg`,
  `              </span>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg`
);

c = c.replace(
  `              </Link>
            </motion>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm`,
  `              </Link>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm`
);

c = c.replace(
  `            </Box>
          </motion>
        </motion>`,
  `            </Box>
          </motion.div>
        </motion.div>`
);

c = c.replace(
  `            </Box>
          </div>
        </div>
      </Box>`,
  `            </Box>
          </motion.div>
        </motion.div>
      </Box>`
);

writeFileSync(p, c);
console.log("hero fixed");
