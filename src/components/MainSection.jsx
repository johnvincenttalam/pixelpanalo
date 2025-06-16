import React, { useRef, useEffect, useState, useCallback } from "react";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import Overview from "./Overview";
import StartPopup from "./StartPopup";
import BG from "../assets/bg1.png";
import { toast } from "react-toastify";
import {
  Gift,
  Eclipse,
  Moon,
  Map,
  ZoomOut,
  RotateCcw,
  Trash2,
} from "lucide-react";
import Tooltip from "../components/Tooltip";

const MainSection = () => {
  const navigate = useNavigate();

  // Popup
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const price = 60; // Example price per pixel

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const minimapCanvasRef = useRef(null);

  const [showMinimap, setShowMinimap] = useState(true);
  const [isGrayscale, setIsGrayscale] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Helper to format coordinates as a consistent 4-digit string (e.g., 1, 5 becomes "0105")
  const formatTicket = useCallback((x, y) => {
    const paddedX = x.toString().padStart(2, "0");
    const paddedY = y.toString().padStart(2, "0");
    return `${paddedX}${paddedY}`;
  }, []);

  // Helper to parse the 4-digit ticket string back into x and y coordinates
  const parseTicket = useCallback((ticketString) => {
    const x = parseInt(ticketString.substring(0, 2), 10);
    const y = parseInt(ticketString.substring(2, 4), 10);
    return [x, y];
  }, []);

  // Determine initial scale based on window width
  const getInitialScale = useCallback(() => {
    if (window.innerWidth < 768) {
      // Assuming mobile devices are less than 768px wide
      return 3.5;
    }
    return 5;
  }, []);

  const [scale, setScale] = useState(5);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [hoverPixel, setHoverPixel] = useState(null); // { x, y } or null
  const [resultMessage, setResultMessage] = useState("");

  //   const gridSize = 100;
  const totalPixels = 2999;
  const derivedGridSize = Math.ceil(Math.sqrt(totalPixels));
  const gridWidth = derivedGridSize;
  const gridHeight = derivedGridSize;

  //   console.log(
  //     `Grid Size: ${gridWidth}x${gridHeight}, Total Pixels: ${totalPixels}`
  //   );
  //   console.log(`Derived Grid Size: ${derivedGridSize}`);

  //   const gridWidth = Math.ceil(Math.sqrt(totalPixels));
  //   const gridHeight = Math.ceil(totalPixels / gridWidth);

  // Define the maximum number of tickets a user can select.
  // If set to 9999, it implies that the total grid might have 10000 pixels (0000-9999),
  // but only 9999 can be actively chosen by the user.
  const [maxSelectableTickets, setMaxSelectableTickets] = useState(9999);

  // Blocked pixel based on its formatted string (e.g., "0000" for 0,0)
  const blockedPixel = formatTicket(0, 0);

  const [takenTickets, setTakenTickets] = useState(() => {
    const initialTaken = new Set();
    // Add specific tickets that are already taken.
    // These are formatted using the formatTicket helper to match the internal representation.
    initialTaken.add(formatTicket(10, 15)); // "1015"
    initialTaken.add(formatTicket(50, 20)); // "5020"
    // If maxSelectableTickets is 9999, the pixel at (99,99) (representing ticket "9999")
    // can be considered permanently taken to effectively limit available tickets to 9999.
    initialTaken.add(formatTicket(99, 99)); // "9999" (the 10000th pixel by value)
    return initialTaken;
  });

  const backgroundImg = useRef(new Image());

  // Load background image once
  useEffect(() => {
    backgroundImg.current.src = BG; // Ensure 1.png is in the public folder
    backgroundImg.current.onload = () => {
      // Force a re-render after image loads to draw grid and minimap
      drawGrid();
      drawMinimap();
    };
  }, []); // Empty dependency array means this runs once on mount

  const applyTransform = useCallback(() => {
    console.log("Applying transform", { scale, offsetX, offsetY });
    console.log("Canvas ref:", canvasRef.current);
    if (canvasRef.current) {
      canvasRef.current.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
      canvasRef.current.style.transformOrigin = "0 0";
      drawMinimap();
    }
  }, [scale, offsetX, offsetY]);

  const calculateFitScale = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current; // assuming you have this ref

    if (!canvas || !container) return 1;

    const scaleX = container.offsetWidth / canvas.width;
    const scaleY = container.offsetHeight / canvas.height;

    return Math.min(scaleX, scaleY); // Keep aspect ratio
  };

  useEffect(() => {
    const fitScale = calculateFitScale();
    setScale(fitScale);
  }, [gridWidth, gridHeight]); // or when canvas size changes

  useEffect(() => {
    const handleResize = () => {
      const fitScale = calculateFitScale();
      setScale(fitScale);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      if (canvas.width === 0 || canvas.height === 0) return;

      const scaleX = container.offsetWidth / canvas.width;
      const scaleY = container.offsetHeight / canvas.height;
      const fitScale = Math.min(scaleX, scaleY);

      setScale(fitScale);
      setOffsetX(0);
      setOffsetY(0);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImg.current.complete) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, gridWidth, gridHeight);

    // Apply grayscale if enabled
    if (isGrayscale) {
      ctx.filter = "grayscale(100%)";
    } else {
      ctx.filter = "none";
    }

    ctx.drawImage(backgroundImg.current, 0, 0, gridWidth, gridHeight);

    // Reset filter before drawing overlays
    ctx.filter = "none";

    // Draw taken tickets (red)
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    takenTickets.forEach((ticket) => {
      const [x, y] = parseTicket(ticket);
      ctx.fillRect(x, y, 1, 1);
    });

    // Draw selected tickets (green)
    ctx.fillStyle = "#008CFF";
    selectedTickets.forEach((ticket) => {
      const [x, y] = parseTicket(ticket);
      ctx.fillRect(x, y, 1, 1);
    });

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 0.01;

    for (let i = 0; i <= gridWidth; i++) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, gridHeight);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= gridHeight; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(gridWidth, i);
      ctx.stroke();
    }

    applyTransform();
  }, [isGrayscale, selectedTickets, takenTickets, applyTransform, parseTicket]); // Dependencies for useCallback

  const drawMinimap = useCallback(() => {
    if (!showMinimap) return;
    const minimapCanvas = minimapCanvasRef.current;
    if (!minimapCanvas || !backgroundImg.current.complete) return;
    const minimapCtx = minimapCanvas.getContext("2d");

    minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    minimapCtx.drawImage(
      backgroundImg.current,
      0,
      0,
      minimapCanvas.width,
      minimapCanvas.height
    );

    const ratioX = minimapCanvas.width / gridWidth;
    const ratioY = minimapCanvas.height / gridHeight;

    // Draw taken tickets on minimap (red)
    minimapCtx.fillStyle = "rgba(255, 0, 0, 0.7)";
    takenTickets.forEach((ticket) => {
      const [x, y] = parseTicket(ticket);
      minimapCtx.fillRect(x * ratioX, y * ratioY, ratioX, ratioY);
    });

    // Draw selected tickets on minimap (green)
    minimapCtx.fillStyle = "#008CFF";
    selectedTickets.forEach((ticket) => {
      const [x, y] = parseTicket(ticket);
      minimapCtx.fillRect(x * ratioX, y * ratioY, ratioX, ratioY);
    });

    // Draw the current view rectangle on the minimap
    const container = containerRef.current;
    if (container) {
      const viewWidth = container.offsetWidth / scale;
      const viewHeight = container.offsetHeight / scale;
      const viewX = -offsetX;
      const viewY = -offsetY;

      minimapCtx.strokeStyle = "blue";
      minimapCtx.lineWidth = 1;
      minimapCtx.strokeRect(
        viewX * ratioX,
        viewY * ratioY,
        viewWidth * ratioX,
        viewHeight * ratioY
      );
    }
  }, [selectedTickets, takenTickets, scale, offsetX, offsetY, parseTicket]);

  useEffect(() => {
    if (showMinimap) {
      drawMinimap();
    }
  }, [showMinimap, drawMinimap]);

  // Redraw grid whenever selectedTickets or takenTickets change
  useEffect(() => {
    drawGrid();
  }, [selectedTickets, takenTickets, drawGrid]);

  // Redraw minimap when its dependencies change
  useEffect(() => {
    drawMinimap();
  }, [scale, offsetX, offsetY, selectedTickets, takenTickets, drawMinimap]);

  const handleCanvasClick = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / scale);
      const y = Math.floor((e.clientY - rect.top) / scale);
      const ticket = formatTicket(x, y); // Use formatTicket here

      // Check if the pixel is within the grid boundaries (0-99 for both x and y)
      if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
        // setResultMessage(`Pixel (${x}, ${y}) is outside the grid boundaries.`);
        toast.error(`Pixel # ${x}${y} is outside the grid boundaries.`);
        return;
      }

      // Check if the ticket is specifically blocked or already taken
      if (ticket === blockedPixel || takenTickets.has(ticket)) {
        // setResultMessage(`Pixel (${x}, ${y}) is already taken or blocked.`);
        toast.warning(`Pixel # ${x}${y} is already taken.`);
        return;
      }

      //   if (pixel >= totalPixels) return;
      //   const linearIndex = x + y * gridWidth;
      //   if (linearIndex >= totalPixels) return;

      // Check if the maximum number of selectable tickets has been reached
      // Only prevent selection if the ticket is NOT already selected and the limit is met
      if (
        selectedTickets.size >= maxSelectableTickets &&
        !selectedTickets.has(ticket)
      ) {
        setResultMessage(
          `⚠️ You can only select up to ${maxSelectableTickets} tickets.`
        );
        return;
      }

      setSelectedTickets((prevSelected) => {
        const newSelected = new Set(prevSelected);

        if (newSelected.has(ticket)) {
          newSelected.delete(ticket);
          setResultMessage(
            `<span className="deselected">Pixel ${ticket} deselected.</span>`
          );
        } else {
          if (newSelected.size >= maxSelectableTickets) {
            setResultMessage(
              `<span class="bg-yellow-100 text-yellow-800 text-xs text-center p-2 rounded">Selection limit of ${maxSelectableTickets} reached.</span>`
            );
            return prevSelected; // Do not add more
          }
          newSelected.add(ticket);
          setResultMessage(
            `<span class="bg-red-100 text-red-600 text-xs text-center p-2 rounded">Pixel ${ticket} selected.</span>`
          );
        }

        return newSelected;
      });
    },
    [
      scale,
      takenTickets,
      formatTicket,
      blockedPixel,
      selectedTickets.size,
      maxSelectableTickets,
    ]
  ); // Added maxSelectableTickets to dependencies

  const clampOffsets = (
    offsetX,
    offsetY,
    scale,
    containerWidth,
    containerHeight,
    gridWidth,
    gridHeight
  ) => {
    const maxX = 0;
    const maxY = 0;

    const minX = Math.min(containerWidth / scale - gridWidth, 0);
    const minY = Math.min(containerHeight / scale - gridHeight, 0);

    const clampedX = Math.min(Math.max(offsetX, minX), maxX);
    const clampedY = Math.min(Math.max(offsetY, minY), maxY);

    return [clampedX, clampedY];
  };

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / scale;
      const mouseY = (e.clientY - rect.top) / scale;

      const delta = e.deltaY > 0 ? -0.5 : 0.5;
      const newScale = Math.min(Math.max(scale + delta, 2), 15);

      setScale(newScale);
      setOffsetX((prev) => {
        const newOffset = prev + mouseX * (scale - newScale);
        const [clampedX] = clampOffsets(
          newOffset,
          offsetY,
          newScale,
          container.offsetWidth,
          container.offsetHeight,
          gridWidth,
          gridHeight
        );
        return clampedX;
      });
      setOffsetY((prev) => {
        const newOffset = prev + mouseY * (scale - newScale);
        const [, clampedY] = clampOffsets(
          offsetX,
          newOffset,
          newScale,
          container.offsetWidth,
          container.offsetHeight,
          gridWidth,
          gridHeight
        );
        return clampedY;
      });
    },
    [scale, offsetX, offsetY]
  );

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;

      if (!isDragging) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / scale);
        const y = Math.floor((e.clientY - rect.top) / scale);

        if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
          setHoverPixel({ x, y, clientX: e.clientX, clientY: e.clientY });
        } else {
          setHoverPixel(null);
        }
        return;
      }

      setOffsetX((prev) => {
        const newOffset = prev + (e.clientX - startX) / scale;
        const [clampedX] = clampOffsets(
          newOffset,
          offsetY,
          scale,
          container.offsetWidth,
          container.offsetHeight,
          gridWidth,
          gridHeight
        );
        return clampedX;
      });
      setOffsetY((prev) => {
        const newOffset = prev + (e.clientY - startY) / scale;
        const [, clampedY] = clampOffsets(
          offsetX,
          newOffset,
          scale,
          container.offsetWidth,
          container.offsetHeight,
          gridWidth,
          gridHeight
        );
        return clampedY;
      });
    },
    [isDragging, startX, startY, scale]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoverPixel(null);
  }, []);

  const resetZoom = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Calculate the best scale to fit the canvas inside the container
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const scaleX = containerWidth / gridWidth;
    const scaleY = containerHeight / gridHeight;
    const initialScale = Math.min(scaleX, scaleY);

    // Calculate centered offsets after scaling
    const offsetX = (containerWidth / initialScale - gridWidth) / 2;
    const offsetY = (containerHeight / initialScale - gridHeight) / 2;

    // Clamp offsets to prevent scrolling beyond edges
    const [clampedX, clampedY] = clampOffsets(
      offsetX,
      offsetY,
      initialScale,
      containerWidth,
      containerHeight,
      gridWidth,
      gridHeight
    );

    setScale(initialScale);
    setOffsetX(clampedX);
    setOffsetY(clampedY);
    setResultMessage("🔄 Zoom and pan reset.");
  }, [gridWidth, gridHeight, clampOffsets]);

  const downloadTickets = useCallback(() => {
    const list = Array.from(selectedTickets).sort().join("\n");
    const blob = new Blob([list], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-tickets.txt";
    a.click();
    URL.revokeObjectURL(url);
    setResultMessage("⬇️ Selected tickets downloaded.");
  }, [selectedTickets]);

  const clearAllTickets = useCallback(() => {
    setSelectedTickets(new Set());
    // setResultMessage("🧹 All tickets cleared.");
    toast.info("All selected tickets have been cleared.");
  }, []);

  // Attach and clean up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      // Using passive: false for wheel event to allow preventDefault
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("click", handleCanvasClick);
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mouseleave", handleMouseLeave);

      // Touch events for mobile responsiveness
      container.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 1) {
            setIsDragging(true);
            setStartX(e.touches[0].clientX);
            setStartY(e.touches[0].clientY);
          }
        },
        { passive: true }
      ); // Passive true for touchstart where preventDefault is not always needed

      container.addEventListener(
        "touchmove",
        (e) => {
          if (isDragging && e.touches.length === 1) {
            e.preventDefault(); // Prevent scrolling while dragging
            setOffsetX((prev) => {
              const newOffset = prev + (e.touches[0].clientX - startX) / scale;
              const [clampedX] = clampOffsets(
                newOffset,
                offsetY,
                scale,
                container.offsetWidth,
                container.offsetHeight,
                gridWidth,
                gridHeight
              );
              return clampedX;
            });
            setOffsetY((prev) => {
              const newOffset = prev + (e.touches[0].clientY - startY) / scale;
              const [, clampedY] = clampOffsets(
                offsetX,
                newOffset,
                scale,
                container.offsetWidth,
                container.offsetHeight,
                gridWidth,
                gridHeight
              );
              return clampedY;
            });
          }
        },
        { passive: false } // Must be false to allow preventDefault
      );

      container.addEventListener("touchend", () => setIsDragging(false), {
        passive: true,
      });
      container.addEventListener("touchcancel", () => setIsDragging(false), {
        passive: true,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("click", handleCanvasClick);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [
    handleCanvasClick,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    isDragging,
    startX,
    startY,
    scale,
  ]); // Added touch event dependencies

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = BG; // Ensure BG is in the public folder
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      drawGrid(ctx); // call your drawing logic
      // applyTransform();
      setIsLoading(false); // hide loader
    };

    // return () => clearTimeout(timeout);
  }, []);

  // Checkout Pixels
  const handleBuy = () => {
    navigate("/checkout", {
      state: {
        selectedTickets: Array.from(selectedTickets),
        totalPixels: selectedTickets.size,
        totalAmount: selectedTickets.size * price,
      },
    });
  };

  return (
    <section className="w-full max-w-[600px] mx-auto py-6 px-4">
      <StartPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <div className="mb-6">
        <Logo />
        <p className="text-center text-sm lg:text-lg">
          Pick Your Lucky Pixel and Win
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <div
            id="container"
            className="aspect-square w-[100%] max-w-[350px] md:max-w-[500px] relative border mx-auto overflow-hidden"
            ref={containerRef}
          >
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 10,
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                Loading...
              </div>
            )}
            <canvas
              id="canvas"
              ref={canvasRef}
              width={gridWidth}
              height={gridHeight}
            ></canvas>
            {showMinimap && (
              <div className="absolute bottom-2 right-2 z-10 h-[60px] w-[60px] border bg-white/80">
                <canvas
                  id="minimap-canvas"
                  ref={minimapCanvasRef}
                  width="100"
                  height="100"
                ></canvas>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end mb-6">
          <Tooltip text="View Prizes">
            <button onClick={() => setIsPopupOpen(true)} className="mr-auto hover:text-[#008CFF] transition-colors">
              <Gift />
            </button>
          </Tooltip>
          <Tooltip text="Grayscale">
            <button
              onClick={() => setIsGrayscale(!isGrayscale)}
              className="text-[10px] text-center hover:text-[#008CFF] transition-colors"
            >
              {isGrayscale ? <Moon className="text-[#008CFF]" /> : <Moon />}
            </button>
          </Tooltip>
          <Tooltip text="Hide/Show Map">
            <button
              onClick={() => setShowMinimap((prev) => !prev)}
              className="text-[10px] text-center hover:text-[#008CFF] transition-colors"
            >
              {showMinimap ? <Map /> : <Map className="text-[#008CFF]" />}
            </button>
          </Tooltip>
          <Tooltip text="Reset Zoom">
            <button onClick={resetZoom} className="text-[10px] text-center hover:text-[#008CFF] transition-colors">
              <RotateCcw />
            </button>
          </Tooltip>
          <Tooltip text="Clear All Selected">
            <button
              onClick={clearAllTickets}
              className="text-[10px] text-center text-red-600"
            >
              <Trash2 />
            </button>
          </Tooltip>
        </div>

        {/* <div
          className="text-xs text-center mb-2"
          dangerouslySetInnerHTML={{ __html: resultMessage }}
        ></div> */}

        {/* <span className="bg-red-100 text-red-600 text-xs text-center p-2 rounded">Deselected</span> */}

        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <p className="text-sm">Selected Pixels</p>
          <div className="card min-h-[55px]">
            <p className="text-[#1B1926] text-sm text-center font-bold font-inter">
              {Array.from(selectedTickets)
                .sort()
                .map((ticket, index) => (
                  <span key={ticket}>
                    {ticket}
                    {index < selectedTickets.size - 1 ? ", " : ""}
                  </span>
                ))}
            </p>
          </div>
        </div>
        <div>
          <Overview
            totalPixels={selectedTickets.size}
            totalAmount={selectedTickets.size * price}
          />
          <button onClick={handleBuy} className="btn-primary">
            Buy
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainSection;
